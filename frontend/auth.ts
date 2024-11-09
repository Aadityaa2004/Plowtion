import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { DefaultSession } from "next-auth";
import client from "./lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";


declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(client),
    ...authConfig,
    callbacks: {
        signIn({ profile }) {
            return profile?.email?.endsWith("@gmail.com") as boolean;
        },
        async session({ session }) {
            // const user = await prisma.user.findUnique({
            //     where: {
            //         email: session?.user?.email as string,
            //     },
            // });
            const user = true
            if (!user) {
                return session;
            }
            // if (user) {
            //     session.user.id = user.id as string;
            //     session.user.name = user.name;
            //     session.user.email = user.email as string;
            //     session.user.role = user.role as string;
            // }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 * 3, // 3 months
        updateAge: 24 * 60 * 60, // 24 hours
    },
});
