import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlatformProvider } from "@/store/PlatformContext";
import ResponsiveLayout from "@/components/shared/ResponsiveLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Novo | On-Demand African Delivery Marketplace",
  description: "Order food, groceries, pharmacy & express courier delivery in Sapele and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-50 dark:bg-slate-950`}>
        <PlatformProvider>
          <ResponsiveLayout>{children}</ResponsiveLayout>
        </PlatformProvider>
      </body>
    </html>
  );
}
