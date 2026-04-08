"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ShoppingBag, Search, X } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useRouter, useSearchParams } from "next/navigation";

export default function ShopHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const { totalItems, toggleCart } = useCart();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle search submission or real-time update
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isSearchOpen || query) {
                const params = new URLSearchParams(searchParams);
                if (query) {
                    params.set("q", query);
                } else {
                    params.delete("q");
                }
                router.replace(`/shop?${params.toString()}`, { scroll: false });
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [query, isSearchOpen, router, searchParams]);

    return (
        <header
            className={`fixed top-0 z-[60] w-full transition-all duration-500 ease-in-out px-6 ${isScrolled
                ? "h-[60px] bg-black/70 backdrop-blur-[10px] border-b border-white/5"
                : "h-[80px] bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between relative">
                {/* Left: Back to Home */}
                <Link
                    href="/"
                    className={`flex items-center space-x-2 text-white/50 hover:text-[#D4AF37] transition-all duration-300 group ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-montserrat uppercase tracking-[0.2em] font-light">
                        Back to Home
                    </span>
                </Link>

                {/* Center: Logo */}
                <div className={`absolute left-1/2 -translate-x-1/2 items-center transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none md:opacity-100' : 'opacity-100'} hidden md:flex`}>
                    <div className="text-center text-[#D4AF37]">
                        <span className="block font-playfair text-xl md:text-2xl tracking-[0.4em] uppercase leading-none">
                            Misk Gazzali
                        </span>
                    </div>
                </div>

                {/* Right: Icons & Inline Search */}
                <div className="flex items-center space-x-6">
                    {/* Inline Search */}
                    <div ref={searchRef} className="flex items-center">
                        {isSearchOpen ? (
                            <div className="flex items-center bg-white/5 border border-[#D4AF37]/50 px-3 py-1.5 transition-all duration-300">
                                <input
                                    autoFocus
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search fragrance..."
                                    className="bg-transparent border-none outline-none text-[11px] font-montserrat uppercase tracking-widest text-[#D4AF37] w-[140px] md:w-[200px] placeholder:text-[#D4AF37]/30"
                                />
                                <button
                                    onClick={() => {
                                        setIsSearchOpen(false);
                                        setQuery("");
                                    }}
                                    className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors ml-2"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-white/50 hover:text-[#D4AF37] transition-colors duration-300 p-2"
                                aria-label="Open Search"
                            >
                                <Search className="w-5 h-5 stroke-[1.5]" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={toggleCart}
                        className="relative text-[#D4AF37] p-2 hover:scale-110 transition-transform duration-300"
                        aria-label="Shopping Bag"
                    >
                        <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                        {totalItems > 0 && (
                            <span className="absolute top-1 right-1 bg-white text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
