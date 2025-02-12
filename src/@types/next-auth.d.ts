import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    token: string;
    data: {
      id: string;
      nome: string;
      username: string;
      access_token: string;
    };
  }
}
