import NextAuth from "next-auth";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./data/user";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await getUserByEmail(credentials.email as string);
                if (!user || !user.hashPassword) return null;

                const bcrypt = require("bcrypt");
                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.hashPassword!
                );
                return passwordsMatch ? {
                    ...user,
                    id: String(user.id)
                } : null;
            }
        })
    ]
})