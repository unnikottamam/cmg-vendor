import React from 'react'
import ProductModal from './components/productModal';
import { getProductData } from '@/lib/product';
import Link from 'next/link';

const ProductPage = async ({ params }: { params: { id: number } }) => {
    const productInfo = await getProductData(params.id);
    if (productInfo === undefined || Object.keys(productInfo).length === 0)
        return (
            <div className="flex flex-col items-center justify-center w-full text-center space-y-2 py-4">
                <h1 className="text-2xl">Product not found</h1>
                <Link className="text-gray-900 bg-slate-300 hover:bg-blue-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium" href="/products">
                    Back to Products
                </Link>
            </div>
        );
    const formattedProductInfo: ProductInfo = {
        id: productInfo.id || '',
        name: productInfo.name || '',
        status: productInfo.status || '',
        sku: productInfo.sku || '',
        link: productInfo.link || ''
    };
    return <ProductModal product={formattedProductInfo} />
}

export default ProductPage