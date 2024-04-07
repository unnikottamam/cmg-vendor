import { Country } from "@prisma/client";
import z from "zod";

export const loginSchema = z.object({
    email: z.string().email("Provide a valid email address"),
    password: z.string().min(8, "Please provide a valid password")
});

export const resetSchema = z.object({
    email: z.string().email("Provide a valid email address"),
});

export const newPasswordSchema = z.object({
    password: z.string().min(8, "Password must have at least 8 characters"),
    token: z.string()
});

export const userSchema = z.object({
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
    recaptchaToken: z.string(),
});

export const userPatchSchema = z.object({
    firstName: z.string().min(3, "First name is required").optional().nullable(),
    lastName: z.string().min(3, "Last name is required").optional().nullable(),
    email: z.string().email("Provide a valid email address").optional().nullable(),
    password: z.string().min(8, "Password must have at least 8 characters").optional().nullable(),
    role: z.string().min(5, "User role not valid").max(10).optional().nullable(),
    phone: z.string().max(15, "Provide a valid phone number").optional().nullable(),
});