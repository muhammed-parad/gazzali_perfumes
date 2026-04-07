"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Loader2 } from "lucide-react";

export default function CartPage() {
    const router = useRouter();
    const { setCartOpen } = useCart();

    useEffect(() => {
        // Automatically open the cart drawer and redirect to shop
        setCartOpen(true);
        router.replace("/shop");
    }, [router, setCartOpen]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <p className="font-playfair text-[#D4AF37] tracking-widest uppercase text-xs">
                Entering Boutique...
            </p>
        </div>
    );
}
