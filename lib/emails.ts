"use server";

import ProductEmailToSales from '@/components/emails/mail-product-sales';
import { defaultEmailSchema } from '@/app/validationSchemas/email'
import { Resend } from 'resend';
import { z } from 'zod';
import { auth } from '@/auth';
import { getUserById } from '@/data/user';
import UserRegistration from '@/components/emails/user-registration';
import ResetPassword from '@/components/emails/reset-password';
import NewProductEmailToSales from '@/components/emails/new-product';
import VerifyEmail from '@/emails/VerifyEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
type EmailData = z.infer<typeof defaultEmailSchema>;

export async function sendVerificationEmail(email: string, token: string, firstName: string) {
    const verifyLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
    return await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: email,
        subject: "Verify your email",
        react: VerifyEmail({ verifyLink: verifyLink, firstName: firstName }),
    });
}

export async function sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXTAUTH_URL}/new-password?token=${token}`;
    return await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: email,
        subject: "Reset your password",
        react: ResetPassword({ resetLink: resetLink, resetStatus: false }),
    });
}

export async function passwordResetSuccessEmail(email: string) {
    const loginLink = `${process.env.NEXTAUTH_URL}/login`;
    return await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: email,
        subject: "Password reset successfully",
        react: ResetPassword({ resetLink: loginLink, resetStatus: true }),
    });
}

export async function newUserRegistrationEmail(user: UserBasicInfo) {
    return await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: process.env.EMAIL_SALES as string,
        subject: "New User registered in the vendor portal",
        react: UserRegistration({ user: user }),
    });
}

export async function newProductEmailToSales(product: { title: string, content: string, category: string, wooId: string, authorId: number, location: string }) {
    const user = await getUserById(product.authorId);
    const userData = {
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        company: user?.company || ''
    }
    const vendorName = `${userData.firstName} ${userData.lastName} ${userData.company ? `from ${userData.company}` : ''}`;
    return await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: process.env.EMAIL_SALES as string,
        subject: `New Product Added by Vendor: ${vendorName}`,
        react: NewProductEmailToSales({ product: product, userData: userData }),
    });
}

export async function sendEmailToSales(product: ProductInfo, emailData: EmailData) {
    const session = await auth();
    const user = await getUserById(Number(session?.user?.id));
    const userData = {
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        company: user?.company || ''
    }
    const vendorName = `${userData.firstName} ${userData.lastName} ${userData.company ? `from ${userData.company}` : ''}`;
    return await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: process.env.EMAIL_SALES as string,
        subject: `Request From Vendor: ${vendorName}`,
        react: ProductEmailToSales({ product: product, userData: userData, emailData: emailData }),
    });
}