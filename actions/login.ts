"use server";

import { loginSchema } from "@/app/validationSchemas/user";
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/emails";
import { generateVerificationToken, getVerificationTokenByUserId } from "@/lib/verificationToken";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof loginSchema>) => {
    const validatedFields = loginSchema.safeParse(values);
    if (!validatedFields.success) return { error: validatedFields.error.format() };

    const { email, password } = validatedFields.data;
    const user = await getUserByEmail(email);
    if (!user) return { error: 'User not found' };

    if (!user.isVerified) {
        const token = await getVerificationTokenByUserId(user.id);
        const currentTime = new Date();
        if (!token || token?.expires <= currentTime) {
            const newToken = await generateVerificationToken(user.id);
            await sendVerificationEmail(user.email, newToken.token);
            return { error: 'Please verify your email to confirm your account, token will expire in 1 hour.' };
        }
        return { error: 'Please verify your email to confirm your account, token will expire in 1 hour.' };
    }
    if (!user.isVerified) return { error: 'You are not allowed to login, please contact sales' };

    try {
        await signIn('credentials', { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials' };
                default:
                    return { error: 'Something went wrong' };
            }
        }
        throw error;
    }
}