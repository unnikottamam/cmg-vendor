import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import axios from "axios";
import { productSchema } from "@/app/validationSchemas/product";
import prisma from "@/prisma/client";
import { newProductEmailToSales } from "@/lib/emails";

export async function GET(req: NextRequest, res: NextResponse) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({}, { status: 401 });
    }

    const products = await axios.get(
        `${process.env.WOO_URL}/wp-json/wc/v3/products/categories?per_page=100`,
        {
            auth: {
                username: process.env.WOO_CONSUMER_KEY as string,
                password: process.env.WOO_SECRET_KEY as string,
            },
        }
    );
    return NextResponse.json(products.data);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session)
        return NextResponse.json({}, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email! }
    });
    if (!user) return NextResponse.json({ error: "You don't have access" }, { status: 404 });

    const formValues = await request.formData();
    const images: File[] = formValues.getAll("files[]") as File[];

    const body = {
        title: formValues.get("title") || "",
        content: formValues.get("content") || "",
        category: formValues.get("category") || "",
        location: formValues.get("location") || "",
        files: images,
    };
    const validation = productSchema.safeParse(body);
    if (!validation.success) return NextResponse.json(validation.error.format(), { status: 400 });

    const savedFilePaths: { src: string; id: string }[] = [];
    const uploadPromises = images.map(async (file) => {
        const imgData = new FormData();
        imgData.append(`file`, file);
        const response = await axios.post(
            'https://stag.coastmachinery.com/wp-json/wp/v2/media',
            imgData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                auth: {
                    username: process.env.WORDPRESS_USER as string,
                    password: process.env.WORDPRESS_PASS as string
                },
            }
        );
        savedFilePaths.push({ src: response.data.source_url, id: response.data.id });
    });
    await Promise.all(uploadPromises);

    const formData = new FormData();
    savedFilePaths.forEach((filePath, index) => {
        formData.append(`images[${index}][src]`, filePath.src);
    });
    formData.append('name', body.title);
    formData.append('type', 'simple');
    formData.append('manage_stock', '1');
    formData.append('stock_status', 'instock');
    formData.append('stock_quantity', '1');
    formData.append('description', body.content);
    formData.append('categories[0][id]', body.category);
    formData.append('status', 'pending');
    const wooProduct = await axios.post(
        `${process.env.WOO_URL}/wp-json/wc/v3/products`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            auth: {
                username: process.env.WOO_CONSUMER_KEY as string,
                password: process.env.WOO_SECRET_KEY as string,
            },
        }
    );

    const deletePromises = savedFilePaths.map(async (file) => {
        await axios.delete(
            `https://stag.coastmachinery.com/wp-json/wp/v2/media/${file.id}?force=true`,
            {
                auth: {
                    username: process.env.WORDPRESS_USER as string,
                    password: process.env.WORDPRESS_PASS as string
                },
            }
        );
    });

    await Promise.all(deletePromises);
    const productIns = {
        title: wooProduct.data.name,
        content: body.content as string,
        category: wooProduct.data.categories[0].name,
        wooId: wooProduct.data.id,
        authorId: user.id,
        location: body.location as string
    };
    await prisma.product.create({
        data: productIns
    });

    await newProductEmailToSales(productIns);
    return NextResponse.json(wooProduct.data, { status: 201 })
}