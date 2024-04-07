"use server";

import { resetSchema } from "@/app/validationSchemas/user";
import { getUserByEmail } from "@/data/user";
import { sendResetPasswordEmail } from "@/lib/emails";
import { generateResetToken, getResetTokenByUserId } from "@/lib/resetToken";
import { z } from "zod";

export const reset = async (values: z.infer<typeof resetSchema>) => {
    const validatedFields = resetSchema.safeParse(values);
    if (!validatedFields.success) return { error: validatedFields.error.format() };

    const { email } = validatedFields.data;
    const user = await getUserByEmail(email);
    if (!user) return { error: 'Email address not found' };

    const token = await getResetTokenByUserId(user.id);
    if (!token || token?.expires <= new Date()) {
        const newToken = await generateResetToken(user.id);
        await sendResetPasswordEmail(user.email, newToken.token);
        return { success: 'Please check your email to reset your password, token will expire in 1 hour' };
    }

    return { success: 'Please check your email to reset your password, token will expire in 1 hour' };
}