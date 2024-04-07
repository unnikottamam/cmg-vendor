import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "email",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) return null
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                if (!user) return null;
                const passwordsMatch = await bcrypt.compare(
                    credentials.password,
                    user.hashPassword!
                );
                return passwordsMatch ? {
                    ...user,
                    id: String(user.id)
                } : null;
            }
        })
    ],
    callbacks: {
        async signIn({ user }) {
            // Prevent users who are not verified from signing in
            return user.isVerified;
        },
        async jwt({ token, user }) {
            return ({ ...token, ...user })
        },
        async session({ session, token, user }) {
            session.user = token
            return session
        },
    },
    session: {
        strategy: 'jwt'
    }
}

export default authOptions;