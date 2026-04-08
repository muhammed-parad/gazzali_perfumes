"use client";

import { useCart } from "../hooks/useCart";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function CartSlider() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, isCartOpen, setCartOpen, toggleCart } = useCart();
    const pathname = usePathname();
    const router = useRouter();

    // Close when clicking outside or pressing Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setCartOpen(false);
        };
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isCartOpen, setCartOpen]);

    const handleCartClick = () => {
        if (pathname === "/") {
            router.push("/shop");
        } else {
            toggleCart();
        }
    };

    return (
        <>
            {/* Floating Cart Button */}
            {pathname === "/" && (
                <button
                    onClick={handleCartClick}
                    className="fixed bottom-24 right-6 md:bottom-28 md:right-8 z-50 p-4 bg-[#D4AF37] text-black rounded-full shadow-lg hover:scale-110 transition-all duration-300 group hidden md:flex"
                >
                    <ShoppingBag className="w-6 h-6" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#D4AF37]">
                            {totalItems}
                        </span>
                    )}
                </button>
            )}

            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300",
                    isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={toggleCart}
            />

            {/* Cart Sidebar */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-full max-w-md bg-[#0B0B0B] border-l border-white/10 z-[101] shadow-2xl transition-transform duration-500 ease-in-out",
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <h2 className="text-xl font-serif text-[#D4AF37] tracking-wider uppercase">Shopping Cart</h2>
                        <button
                            onClick={toggleCart}
                            className="p-2 hover:bg-white/5 rounded-full text-misty-grey hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                <ShoppingBag className="w-16 h-16 text-white/10" />
                                <p className="text-misty-grey">Your cart is empty.</p>
                                <button
                                    onClick={toggleCart}
                                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white text-xs font-bold tracking-widest uppercase hover:bg-white/10"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="w-20 h-24 bg-white/5 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                        <img
                                            src={item.image_url || "/images/others/bottles.png"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-white font-medium text-sm line-clamp-1">{item.name}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                                                    className="text-white/20 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-[#D4AF37] text-xs">{item.price} QAR</p>
                                                <span className="text-[10px] text-white/30 uppercase tracking-widest">{item.selectedSize}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 mt-4">
                                            <div className="flex items-center border border-white/10 rounded-full overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                                    className="p-1.5 hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-3 text-xs text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                                    className="p-1.5 hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-sm space-y-4">
                            <div className="flex justify-between items-center text-white">
                                <span className="text-misty-grey text-sm uppercase tracking-widest">Total</span>
                                <span className="text-xl font-serif text-[#D4AF37]">{totalPrice} QAR</span>
                            </div>
                            <Link
                                href="/checkout"
                                onClick={() => setCartOpen(false)}
                                className="block w-full py-4 bg-[#D4AF37] text-black text-center font-bold tracking-[0.2em] rounded-full uppercase hover:bg-white transition-colors duration-300"
                            >
                                Checkout Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
