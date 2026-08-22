import type { Metadata } from "next";
import "./globals.css";
import { PlatformProvider } from "@/store/PlatformContext";
import ResponsiveLayout from "@/components/shared/ResponsiveLayout";

export const metadata: Metadata = {
  title: "Novo | On-Demand African Delivery Marketplace",
  description: "Order food, groceries, pharmacy & express courier delivery fast and reliably across nationwide locations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50 dark:bg-slate-950">
        <PlatformProvider>
          <ResponsiveLayout>{children}</ResponsiveLayout>
        </PlatformProvider>
      </body>
    </html>
  );
}
