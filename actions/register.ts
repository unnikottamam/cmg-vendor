"use server";

import { userSchema } from "@/app/validationSchemas/user";
import { verifyRecaptcha } from "@/data/captcha";
import { getUserByEmail } from "@/data/user";
import { newUserRegistrationEmail, sendVerificationEmail } from "@/lib/emails";
import { generateVerificationToken } from "@/lib/verificationToken";
import prisma from "@/prisma/client";
import { Country } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";

export const register = async (values: z.infer<typeof userSchema>) => {
    const validatedFields = userSchema.safeParse(values);
    if (!validatedFields.success) return { error: validatedFields.error.format() };

    const { email, phone, firstName, lastName, city, state, streetAddress, zip, country, password, recaptchaToken } = validatedFields.data;

    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
        return { error: 'You are not athorized to register, try again or contact sales team' };
    }

    const user = await getUserByEmail(email);
    if (user) return { error: 'User already exists' };

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
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
        }
    });

    const token = await generateVerificationToken(newUser.id);
    await sendVerificationEmail(newUser.email, token.token, newUser.firstName);
    const newUserRegistrationData = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        company: newUser.company,
        streetAddress: newUser.streetAddress,
        city: newUser.city,
        state: newUser.state,
        zip: newUser.zip,
        country: newUser.country,
    }
    await newUserRegistrationEmail(newUserRegistrationData);

    return { success: "User registered successfully, please verify your email address to login, token will expire in 1 hour (check spam folder).", email: newUser.email }
}