import { v4 as uuidv4 } from 'uuid';
import prisma from "@/prisma/client";

export const getVerificationTokenByUserId = async (userId: number) => {
    try {
        return await prisma.verificationToken.findFirst({
            where: {
                userId
            }
        });
    } catch {
        return null;
    }
}

export const getVerificationTokenByToken = async (token: string) => {
    try {
        return await prisma.verificationToken.findUnique({
            where: {
                token
            }
        });
    } catch {
        return null;
    }
}

export const generateVerificationToken = async (userId: number) => {
    const existingToken = await getVerificationTokenByUserId(userId);
    if (existingToken) {
        await deleteVerificationToken(existingToken.id);
    }

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);
    return await prisma.verificationToken.create({
        data: {
            token,
            expires,
            userId
        }
    });
}

export const deleteVerificationToken = async (tokenId: number) => {
    return await prisma.verificationToken.delete({
        where: {
            id: tokenId
        }
    });
}

export const setUserAsVerified = async (token: string) => {
    const verificationToken = await getVerificationTokenByToken(token);
    if (!verificationToken) return { error: 'Invalid token' };

    const currentTime = new Date();
    if (verificationToken.expires <= currentTime) {
        return { error: 'Token expired' };
    }

    await prisma.user.update({
        where: {
            id: verificationToken.userId
        },
        data: {
            isVerified: true
        }
    });

    await deleteVerificationToken(verificationToken.id);
    return { success: 'User successfully verified' };
}