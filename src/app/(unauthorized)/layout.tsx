import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "UNVRS App",
  description: "Universe In One",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="w-full h-screen flex flex-col">
          {children}
          <Footer/>
        </main>
      </body>
    </html>
  );
}
