import type { Metadata } from "next";
import "./globals.css";
import { PlatformProvider } from "@/store/PlatformContext";
import ResponsiveLayout from "@/components/shared/ResponsiveLayout";

export const metadata: Metadata = {
  title: "Novo | On-Demand Delivery Express",
  description: "Order food, groceries, pharmacy & express courier delivery fast and reliably across nationwide locations.",
  icons: {
    icon: "/novo-logo/01_Motion_N/01-motion-n_green.svg",
    shortcut: "/novo-logo/01_Motion_N/01-motion-n_green.svg",
    apple: "/novo-logo/01_Motion_N/01-motion-n_green.png",
  },
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
