"use server";

import { newPasswordSchema } from "@/app/validationSchemas/user";
import { getUserById } from "@/data/user";
import bcrypt from "bcrypt";
import { passwordResetSuccessEmail } from "@/lib/emails";
import { deleteResetToken, getResetTokenByToken } from "@/lib/resetToken";
import { z } from "zod";
import prisma from "@/prisma/client";

export const newPassword = async (values: z.infer<typeof newPasswordSchema>) => {
    const validatedFields = newPasswordSchema.safeParse(values);
    if (!validatedFields.success) return { error: validatedFields.error.format() };

    const { password, token } = validatedFields.data;
    const resetToken = await getResetTokenByToken(token);
    if (!resetToken || resetToken.expires <= new Date()) return { error: 'Invalid or expired token' };

    const user = await getUserById(resetToken.userId);
    if (!user) return { error: 'User with this token not found' };

    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            hashPassword
        }
    });

    await deleteResetToken(resetToken.id);
    await passwordResetSuccessEmail(user.email);
    return { success: 'Password updated successfully' };
}