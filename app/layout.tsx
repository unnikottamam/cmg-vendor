import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Menu from "./components/Menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coast Machinery Dashboard",
  description: "Coast Machinery Vendor Dashboard Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Menu />
        <div className="mx-auto max-w-7xl py-4 px-2 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
