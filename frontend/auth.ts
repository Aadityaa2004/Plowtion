import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { DefaultSession } from "next-auth";
import client from "./lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(client),
    ...authConfig,
    callbacks: {
        async session({ session, user }) {
            if (user) {
                session.user.role = "user";
                session.user.image = user.image;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 * 3, // 3 months
        updateAge: 24 * 60 * 60, // 24 hours
    },
});