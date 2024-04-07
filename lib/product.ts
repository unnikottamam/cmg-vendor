"use server";
import axios from "axios";

export const getProductData = async (productId: number) => {
    try {
        const response = await axios.get(
            `${process.env.WOO_URL}/wp-json/wc/v3/products/${productId}`,
            {
                auth: {
                    username: process.env.WOO_CONSUMER_KEY as string,
                    password: process.env.WOO_SECRET_KEY as string,
                }
            },
        );
        const { id, name, status, sku, permalink } = response.data;
        return { id, name, status, sku, link: permalink };
    } catch {
        return {}
    }
}