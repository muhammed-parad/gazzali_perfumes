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
  metadataBase: new URL("https://gazzali-perfumes.vercel.app"),

  title: "Misk Perfumes Qatar | Long Lasting Oud & Musk | Gazzali Perfumes",

  description:
    "Buy premium attar perfumes in Qatar. Explore long-lasting oud, musk & alcohol-free fragrances from Gazzali Perfumes.",

  applicationName: "Gazzali Perfumes",

  openGraph: {
    title: "Gazzali Perfumes Qatar",
    description:
      "Premium attar perfumes and luxury fragrances in Qatar.",
    siteName: "Gazzali Perfumes",
    url: "https://gazzali-perfumes.vercel.app",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Gazzali Perfumes Qatar",
    description:
      "Premium attar perfumes and long-lasting fragrances.",
  },

  manifest: "/site.webmanifest",

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
