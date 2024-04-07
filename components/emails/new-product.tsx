import React from 'react';

interface NewProductEmailToSalesProps {
    product: {
        title: string;
        content: string;
        category: string;
        wooId: string;
        authorId: number;
        location: string;
    };
    userData: {
        email: string;
        firstName: string;
        lastName: string;
        company: string;
    }
}

const NewProductEmailToSales = ({ product, userData }: NewProductEmailToSalesProps) => {
    return (
        <div>
            <p>Product Name: {product.title}</p>
            <p>Product Link: <a href={`${process.env.WOO_URL}/wp-admin/post.php?post=${product.wooId}&action=edit`}>Product Link</a></p>
            <hr />
            <p>Name: {userData.firstName} {userData.lastName}</p>
            <p>Email: {userData.email}</p>
            {userData.company && <p>Company: {userData.company}</p>}
            <hr />
        </div>
    )
};

export default NewProductEmailToSales;