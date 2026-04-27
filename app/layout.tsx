import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

import { CartProvider } from "../hooks/useCart";
import CartSlider from "../components/CartSlider";
import WhatsAppButton from "../components/WhatsAppButton";
import LenisProvider from "../components/LenisProvider";

// Fonts
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

// Metadata (SEO + Google Verification)
export const metadata: Metadata = {
  title: "Gazzali Perfumes Qatar | Attar & Luxury Fragrances",
  description:
    "Gazzali Perfumes is a Qatar-based perfume brand offering premium attar perfumes and long-lasting fragrances crafted for men and women. Discover a wide collection of alcohol-free attars, oud perfumes, musk fragrances, and luxury scents made with high-quality ingredients for a rich and lasting aroma.Buy attar perfumes online from Gazzali Perfumes and experience the elegance of traditional Arabian perfumery blended with modern fragrance styles. Our collection includes long-lasting attar perfumes, designer-inspired fragrances, and premium perfumes suitable for daily wear and special occasions.Whether you are looking for the best attar perfumes in Qatar, alcohol-free perfumes, or strong long-lasting perfumes, Gazzali Perfumes provides a wide range of options at affordable prices. Explore fragrances with notes of oud, jasmine, rose, amber, and musk that leave a lasting impression.Shop online for attar perfumes in Qatar and enjoy high-quality fragrances designed for performance and elegance. Gazzali Perfumes is your trusted destination for luxury perfumes, Arabic attars, and premium scent collections.",

  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },

  // ✅ Google Search Console verification
  verification: {
    google: "google902bdb7995bae4fa",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${montserrat.variable} ${playfair.variable} antialiased selection:bg-gold-accent-1/30`}
      >
        <LenisProvider>
          <CartProvider>
            {children}
            <CartSlider />
          </CartProvider>
        </LenisProvider>

        <WhatsAppButton />
      </body>
    </html>
  );
}
