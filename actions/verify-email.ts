"use server";

import { setUserAsVerified } from "@/lib/verificationToken";


export const verifyEmail = async (token: string) => {
    const verification = await setUserAsVerified(token);
    if (verification.error) {
        return { error: verification.error };
    }
    return { success: verification.success };
}