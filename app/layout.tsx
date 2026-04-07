import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../hooks/useCart";
import CartSlider from "../components/CartSlider";

const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Gazzali Perfumes | Discover Your Signature Scent",
  description: "Experience premium, long-lasting fragrances with exotic notes of Bergamot, Jasmine, and Oud.",
};

import WhatsAppButton from "../components/WhatsAppButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${montserrat.variable} ${playfair.variable} antialiased selection:bg-gold-accent-1/30`}>
        <CartProvider>
          {children}
          <CartSlider />
        </CartProvider>

        <WhatsAppButton />
      </body>
    </html>
  );
}
