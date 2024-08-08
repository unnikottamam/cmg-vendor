"use server";

import prisma from "@/prisma/client";
import axios from 'axios';

export const getUnassignedProducts = async () => {
    const products: ProductAssign[] = [];
    const internalProducts = await prisma.product.findMany({
        orderBy: { id: "desc" }
    });
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
                'exclude': internalProducts.map(product => product.wooId).join(','),
                'per_page': 30
            }
        }
    );
    if (response.data.length) {
        response.data.forEach((product: { id: string; name: string; sku: string; categories: { id: string, name: string, slug: string }[]; }) => {
            const category = product.categories && product.categories.length ? product.categories[0].name : 'Uncategorized';
            const { id, name, sku } = product;
            products.push({ id, name, category, sku });
        });
    }
    return products;
}

export const getProductByUserId = async (userId: number) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                authorId: userId
            }
        });

        if (!products.length) return null;
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
                    'include': products.map(product => product.wooId).join(',')
                }
            },
        );

        const productsWithImages: ProductItem[] = [];
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
                products.filter((internalProduct) => {
                    if (internalProduct.wooId === Number(id)) {
                        location = internalProduct.location;
                    }
                });
                productsWithImages.push({ id, name, status, sku, link: permalink, imgSrc, leadCount, sold, location });
            });
        }

        return productsWithImages;
    } catch (error) {
        return null;
    }
}