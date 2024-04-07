"use client";
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { IoClose } from "react-icons/io5";
import Link from 'next/link';
import ProductEmailForm from './productEmailForm';

const ProductModal = ({ product }: { product: ProductInfo }) => {
    const [isMount, setIsMount] = useState(false)
    useEffect(() => {
        setIsMount(true)
    }, []);

    return isMount ? <Dialog open={isMount}>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <Link href="/products" className="absolute right-4 top-4 rounded-sm border-2 border-slate-400 opacity-80 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <IoClose size={25} />
                </Link>
                <DialogTitle>Contact Sales</DialogTitle>
                <DialogDescription>
                    Send a request to the sales team to make changes to the product; <br />
                    {product.name} : {product.sku || 'No SKU'}
                </DialogDescription>
            </DialogHeader>
            <ProductEmailForm product={product} />
        </DialogContent>
    </Dialog> : ''
}

export default ProductModal