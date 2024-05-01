import { Country } from "@prisma/client";
import z from "zod";

export const vendorSchema = z.object({
    email: z.string().email("Provide a valid email address"),
    password: z.string().min(8, "Password must have at least 8 characters"),
    firstName: z.string().min(3, "First name is required"),
    lastName: z.string().min(3, "Last name is required"),
    phone: z.string().min(10).max(15, "Provide a valid phone number"),
    city: z.string().min(2, "Provide a valid city"),
    state: z.string().min(2, "Provide a valid state"),
    streetAddress: z.string().min(2, "Provide a valid street address"),
    zip: z.string().min(2, "Provide a valid zip code"),
    country: z.string().min(2, "Select a country").transform((value) => value.toUpperCase() as Country),
});

export const assignVendorSchema = z.object({
    vendorId: z.string({ required_error: "Select a vendor" }),
    productId: z.string({ required_error: "Select a product" }),
    location: z.string().min(2, "Provide a valid location"),
});