import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/cart-context";
import { FTRE_CustomCursor } from "@/components/ui/custom-cursor";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "FOUTOURE | Streetwear Clothing Brand",
  description: "Premium streetwear clothing brand for the bold and fearless.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          inter.variable,
          bebasNeue.variable,
          "min-h-screen bg-black font-sans antialiased"
        )}
      >
        <CartProvider>
          {children}
          <FTRE_CustomCursor />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
} 