"use server";

import { assignVendorSchema, vendorSchema } from "@/app/validationSchemas/vendor";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcrypt";
import prisma from "@/prisma/client";
import { Country } from "@prisma/client";
import axios from "axios";

export const createVendor = async (values: any) => {
    const validatedFields = vendorSchema.safeParse(values);
    if (!validatedFields.success) return { error: validatedFields.error.format() };

    const { email, phone, firstName, lastName, city, state, streetAddress, zip, country, password } = validatedFields.data;

    const user = await getUserByEmail(email);
    if (user) return { error: 'User already exists' };

    const hashPassword = await bcrypt.hash(password, 10);
    const newVendor = await prisma.user.create({
        data: {
            email,
            phone,
            firstName,
            lastName,
            city,
            state,
            streetAddress,
            zip,
            country: country as Country,
            hashPassword,
            role: 'EDITOR',
            isVerified: true
        }
    });

    return { success: "Vendor created successfully", email: newVendor.email };
}

export const assignVendor = async (values: any) => {
    const validatedFields = assignVendorSchema.safeParse(values);
    if (!validatedFields.success) return { error: validatedFields.error.format() };

    const { vendorId, productId, location } = validatedFields.data;
    const vendor = await prisma.user.findUnique({
        where: { id: Number(vendorId) }
    });
    if (!vendor) return { error: 'Vendor not found' };

    const product = await prisma.product.findUnique({
        where: { id: Number(productId) }
    });
    if (product) return { error: 'Product already assigned to a vendor' };

    const wooProduct = await axios.get(
        `${process.env.WOO_URL}/wp-json/wc/v3/products/${productId}`,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            auth: {
                username: process.env.WOO_CONSUMER_KEY as string,
                password: process.env.WOO_SECRET_KEY as string,
            }
        }
    );
    const category = wooProduct.data.categories ? wooProduct.data.categories[0].name : 'No category';

    const vendorProduct = await prisma.product.create({
        data: {
            authorId: Number(vendorId),
            wooId: Number(productId),
            content: '',
            title: wooProduct.data.name || 'No product name',
            location,
            category
        }
    });

    return { success: "Product assigned successfully", id: vendorProduct.id };
}