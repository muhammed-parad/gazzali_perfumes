"use client";

import { useCart, type Product } from "../../hooks/useCart";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShopProductCardProps {
    product: Product;
    index: number;
}

export default function ShopProductCard({ product, index }: ShopProductCardProps) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('50ml');
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, selectedSize, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // Use specific price based on selected size, fallback to standard price
    const displayPrice = selectedSize === '50ml'
        ? (product.price_50ml || product.price)
        : (product.price_100ml || product.price);

    // Extract notes if available, otherwise use defaults
    const notes = product.description?.split('•').slice(0, 3).map(n => n.trim()) || ["OUD", "ROSE", "AMBER"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            className="group relative flex flex-col space-y-6 bg-black"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container: 1:1 Aspect Ratio with Radial Gradient */}
            <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)] border border-white/5">
                {/* The Bottle with Drop Shadow and Scale Effect */}
                <motion.img
                    src={product.image_url || "/images/others/bottles.png"}
                    alt={product.name}
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full object-contain p-4 md:p-8 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                />

                {/* Shimmer Effect on Hover */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Information Stack */}
            <div className="space-y-3 md:space-y-4 px-1 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                    <h3 className="font-playfair text-sm md:text-xl text-white tracking-wide line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="font-montserrat text-[8px] md:text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] font-medium line-clamp-1">
                        {notes.join(" • ")}
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Size Selector */}
                    <div className="flex items-center gap-2">
                        {['50ml', '100ml'].map((size) => (
                            <button
                                key={size}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedSize(size as any);
                                }}
                                className={`px-4 py-1.5 text-[9px] md:text-[10px] font-montserrat uppercase tracking-widest border transition-all ${selectedSize === size
                                    ? "bg-[#D4AF37] border-[#D4AF37] text-black font-bold"
                                    : "bg-transparent border-white/10 text-white/40 hover:border-white/20"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="font-montserrat text-xs md:text-sm text-white/80 font-light tracking-wider">
                            {displayPrice} QAR
                        </span>

                        {/* Quantity Selector */}
                        <div className="flex items-center border border-white/10 overflow-hidden">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setQuantity(Math.max(1, quantity - 1));
                                }}
                                className="px-2 py-1 hover:bg-white/5 text-white/40"
                            >
                                -
                            </button>
                            <span className="px-3 text-[10px] text-white tabular-nums">{quantity}</span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setQuantity(quantity + 1);
                                }}
                                className="px-2 py-1 hover:bg-white/5 text-white/40"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Ghost Button: Full Width */}
                    <button
                        onClick={handleAddToCart}
                        disabled={added}
                        className={`w-full py-3 md:py-4 border border-[#D4AF37] transition-all duration-500 uppercase text-[8px] md:text-[10px] font-montserrat font-bold tracking-[0.3em] flex items-center justify-center space-x-2 ${added
                            ? "bg-[#D4AF37] text-black"
                            : "bg-transparent text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                            }`}
                    >
                        {added ? (
                            <>
                                <Check className="w-3 h-3" />
                                <span>Added to Cart</span>
                            </>
                        ) : (
                            <span>Add to Cart</span>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
