import { api } from "@/lib/axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialProviders from "next-auth/providers/credentials";

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialProviders({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, _) {
        const response = await api.post(`/login`, {
          username: credentials?.username,
          password: credentials?.password,
        });

        const user = response.data;

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },

    async session({ session, token }) {
      session = token.user as any;
      return session;
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };
