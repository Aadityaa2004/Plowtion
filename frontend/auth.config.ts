import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
    trustHost: true,
    providers: [Google],
} satisfies NextAuthConfig;
