import type { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/client";
import { getUserById } from "./data/user";

export default {
    providers: [],
    callbacks: {
        async signIn({ user }) {
            const existingUser = await getUserById(Number(user.id));
            if (!existingUser?.isVerified || !existingUser?.isActive) {
                return false;
            }
            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;
            const existingUser = await getUserById(Number(token.sub));
            if (!existingUser) return token;
            token.role = existingUser.role;
            return token;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt'
    },
} satisfies NextAuthConfig