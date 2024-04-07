import { v4 as uuidv4 } from 'uuid';
import prisma from "@/prisma/client";

export const getResetTokenByUserId = async (userId: number) => {
    try {
        return await prisma.passwordResetToken.findFirst({
            where: {
                userId
            }
        });
    } catch {
        return null;
    }
}

export const getResetTokenByToken = async (token: string) => {
    try {
        return await prisma.passwordResetToken.findUnique({
            where: {
                token
            }
        });
    } catch {
        return null;
    }
}

export const generateResetToken = async (userId: number) => {
    const existingToken = await getResetTokenByUserId(userId);
    if (existingToken) {
        await deleteResetToken(existingToken.id);
    }

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);
    return await prisma.passwordResetToken.create({
        data: {
            token,
            expires,
            userId
        }
    });
}

export const deleteResetToken = async (tokenId: number) => {
    return await prisma.passwordResetToken.delete({
        where: {
            id: tokenId
        }
    });
}