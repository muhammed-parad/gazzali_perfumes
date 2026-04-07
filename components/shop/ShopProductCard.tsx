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

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

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
                    className="w-full h-full object-contain p-8 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
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

                {/* Quick View / Add + */}
                <motion.button
                    onClick={handleAddToCart}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-none text-[10px] font-montserrat uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
                >
                    {added ? <Check className="w-3 h-3" /> : "Quick Add +"}
                </motion.button>
            </div>

            {/* Information Stack */}
            <div className="space-y-4 px-1">
                <div className="space-y-1">
                    <h3 className="font-playfair text-xl text-white tracking-wide">
                        {product.name}
                    </h3>
                    <p className="font-montserrat text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] font-medium">
                        {notes.join(" • ")}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <span className="font-montserrat text-sm text-white/80 font-light tracking-wider">
                        {product.price} QAR
                    </span>
                </div>

                {/* Ghost Button: Full Width */}
                <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`w-full py-4 border border-[#D4AF37] transition-all duration-500 uppercase text-[10px] font-montserrat font-bold tracking-[0.3em] flex items-center justify-center space-x-2 ${added
                        ? "bg-[#D4AF37] text-black"
                        : "bg-transparent text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                        }`}
                >
                    {added ? (
                        <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to Bag</span>
                        </>
                    ) : (
                        <span>Add to Cart</span>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
