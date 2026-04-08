"use client";

import { useCart, type Product } from "../hooks/useCart";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product, '50ml', 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="group relative bg-[#131313] border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-500 shadow-xl">
            {/* Product Image */}
            <div className="aspect-[4/5] relative overflow-hidden">
                <img
                    src={product.image_url || "/images/others/bottles.png"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quick Add Overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <button
                        onClick={handleAddToCart}
                        className={`w-full py-3 rounded-full font-bold text-xs tracking-widest uppercase flex items-center justify-center space-x-2 transition-all duration-300 ${added
                            ? "bg-green-500 text-white"
                            : "bg-white text-black hover:bg-[#D4AF37]"
                            }`}
                    >
                        {added ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Added to Cart</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add to Cart</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-serif text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    <span className="text-[#D4AF37] font-bold text-lg whitespace-nowrap">
                        {product.price} <small className="text-[10px] uppercase font-normal ml-1">QAR</small>
                    </span>
                </div>

                <p className="text-misty-grey/60 text-sm line-clamp-2 min-h-[40px]">
                    {product.description || "Experience the essence of luxury with Gazzali Perfumes."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[10px] text-misty-grey/30 uppercase tracking-[0.2em]">
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                    <div className="flex items-center space-x-1 text-[#D4AF37] text-[10px]">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
