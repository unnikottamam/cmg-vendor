import prisma from '@/prisma/client';
import Link from 'next/link'
import React from 'react'
import { auth } from "@/auth";
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import { BsEnvelope } from "react-icons/bs";
import { LuImage } from "react-icons/lu";

const ProductsPage = async () => {
    const { user } = await auth() as { user: { id: string, role: string } };
    const isAdmin = user?.role === "ADMIN";
    let internalProducts: any[] = [];
    if (isAdmin) {
        internalProducts = await prisma.product.findMany({
            orderBy: { id: "desc" }
        });
    } else {
        internalProducts = await prisma.product.findMany({
            where: { authorId: Number(user?.id) },
            orderBy: { id: "desc" }
        });
    }
    let products: ProductItem[] = [];
    if (internalProducts.length) {
        const response = await axios.get(
            `${process.env.WOO_URL}/wp-json/wc/v3/products`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                auth: {
                    username: process.env.WOO_CONSUMER_KEY as string,
                    password: process.env.WOO_SECRET_KEY as string,
                },
                params: {
                    'include': internalProducts.map(product => product.wooId).join(',')
                }
            },
        );
        if (response.data.length) {
            response.data.forEach((product: { id: string; name: string; status: string; sku: string; permalink: string; images: { src: string; }[]; meta_data: { key: string, value: string }[]; stock_quantity: string; stock_status: string }) => {
                let imgSrc = '';
                if (product.images.length) {
                    imgSrc = product.images[0].src;
                }
                let leadCount = 0;
                if (product.meta_data.length) {
                    product.meta_data.forEach((meta: { key: string; value: string }) => {
                        if (meta.key === 'lead_count' && meta.value) {
                            leadCount = parseInt(meta.value);
                        }
                    });
                }
                const { id, name, status, sku, permalink } = product;
                let sold = true;
                if (product.stock_status === 'instock') {
                    sold = false;
                }
                let location = '';
                internalProducts.filter((internalProduct) => {
                    if (internalProduct.wooId === id) {
                        location = internalProduct.location;
                    }
                });
                products.push({ id, name, status, sku, link: permalink, imgSrc, leadCount, sold, location });
            });
        }
    }

    return (
        <>
            <div className="flex justify-between items-center border-b border-slate-300 pb-3 w-full">
                <h1 className="text-xl font-semibold text-slate-600">
                    {isAdmin ? 'All' : 'My'} Listing
                </h1>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">
                            <LuImage size={18} />
                        </TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead className="w-32">Status</TableHead>
                        <TableHead className="w-32">Location</TableHead>
                        <TableHead className="w-32">No. Enquiry</TableHead>
                        <TableHead className="w-32">SKU</TableHead>
                        <TableHead className="w-16"></TableHead>
                        {!isAdmin ? <TableHead className="w-36 text-center">
                            <BsEnvelope className="inline-flex" size={18} />
                        </TableHead> : <TableHead className="w-16"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length ? products.map((product) => {
                        const isPublish = product.status === "publish";
                        let statusColor = 'bg-orange-300';
                        let status = product.status;
                        if (isPublish) {
                            statusColor = product.sold ? 'bg-red-300' : "bg-green-300";
                            status = product.sold ? 'Sold' : status;
                        }
                        const imgEle = product.imgSrc ? <Image width={60} height={60} src={product.imgSrc} alt={product.name} className="object-cover rounded-full" /> : <div className="h-12 w-1h-12 bg-gray-200 rounded-full"></div>;
                        return (
                            <TableRow key={product.id}>
                                <TableCell>{imgEle}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 justify-center text-gray-800 w-[70px] ${statusColor}`}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                </TableCell>
                                <TableCell>{product.location === "Go to CMG" ? "CMG" : product.location}</TableCell>
                                <TableCell>{isPublish ? product.leadCount : 'N/A'}</TableCell>
                                <TableCell>{product.sku || 'N/A'}</TableCell>
                                <TableCell>
                                    {isPublish &&
                                        <Link className="text-white bg-blue-600 hover:bg-gray-700 rounded-md px-2 py-1 text-sm" target="_blank" href={product.link}>
                                            View
                                        </Link>
                                    }
                                </TableCell>
                                {!isAdmin ? <TableCell className="text-right">
                                    <Link target="_blank" scroll={false} className="text-white bg-green-600 hover:bg-gray-700 rounded-md px-2 py-1 justify-center text-sm flex" href={`/products/${product.id}`}>
                                        Contact Sales
                                    </Link>
                                </TableCell> : <TableCell className="text-right">
                                    <Link className="text-white bg-destructive hover:bg-gray-700 rounded-md px-2 py-1 text-sm" target="_blank" href={`${process.env.WOO_URL}/wp-admin/post.php?post=${product.id}&action=edit`}>
                                        Edit
                                    </Link>
                                </TableCell>}
                            </TableRow>
                        );
                    }) : (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">No products to show</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

export default ProductsPage