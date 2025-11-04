import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./connect";


declare module "next-auth" {
    interface Session {
        user: User & {
            isAdmin: boolean;
        };
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        isAdmin: boolean;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    providers: [
        GoogleProvider({
            // clientId: process.env.GOOGLE_ID as string,
            // clientSecret: process.env.GOOGLE_SECRET as string,
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        })
    ],
    callbacks: {
        async jwt({ token }) {
            // Nếu đã có email, lấy user từ database
            if (token?.email) {
                const userInDb = await prisma.user.findUnique({
                    where: { email: token.email },
                });

                if (userInDb) {
                    token.name = userInDb.name;
                    token.picture = userInDb.image;
                    token.isAdmin = userInDb.isAdmin;
                }
            }

            return token;
        },

        async session({ token, session }) {
            // Gán lại từ token vào session.user
            if (token && session.user) {
                session.user.name = token.name;
                session.user.image = token.picture;
                session.user.isAdmin = token.isAdmin;
            }

            return session;
        },
    },

};

export const getAuthSession = () => getServerSession(authOptions);