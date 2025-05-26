"use client";

import { ReactNode, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { api } from "@/lib/axios";
import { signOut } from "next-auth/react";

interface NextAuthSessionProviderProps {
  children: ReactNode;
}

export default function NextAuthSessionProvider({
  children,
}: NextAuthSessionProviderProps) {
  async function removeSession() {
    signOut({
      redirect: true,
      callbackUrl: "/",
    });
  }

  useEffect(() => {
    const subscribe = api.registerIntercepTokenMenager(removeSession);

    return () => {
      subscribe();
    };
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
