import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Provider } from "./providers";
import { Toaster } from "sonner";
import NextAuthSessionProvider from "@/provider/sessionProvider";
import "dayjs/locale/pt-br";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Casa De Euripedes ADMIN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className}`}>
        <NextAuthSessionProvider>
          <Toaster position="bottom-center" />
          <Provider>{children}</Provider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
