import { defaultEmailSchema } from '@/app/validationSchemas/email';
import React from 'react';
import { z } from 'zod';

interface ProductEmailToSalesProps {
    product: ProductInfo;
    userData: {
        email: string;
        firstName: string;
        lastName: string;
        company: string;
    },
    emailData: z.infer<typeof defaultEmailSchema>;
}

const ProductEmailToSales = ({ product, userData, emailData }: ProductEmailToSalesProps) => {
    return (
        <div>
            <p>Name: {userData.firstName} {userData.lastName}</p>
            <p>Email: {userData.email}</p>
            {userData.company && <p>Company: {userData.company}</p>}
            <hr />
            <p>Subject: {emailData.subject}</p>
            <p>Message: {emailData.content}</p>
            <hr />
            <p>Product Name: {product.name} - SKU: {product.sku || 'N/A'}</p>
            <p>Product Link: <a href={product.link}>{product.link}</a></p>
        </div>
    )
};

export default ProductEmailToSales;