"use client";

import { type Product } from "../../hooks/useCart";
import ShopProductCard from "./ShopProductCard";

interface ShopProductGridProps {
    products: Product[];
}

export default function ShopProductGrid({ products }: ShopProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-4 text-center">
                <p className="font-montserrat text-white/40 uppercase tracking-[0.3em] text-xs">
                    The collection is currently private
                </p>
            </div>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-6 py-20 pb-40">
            {/* Asymmetric Masonry Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-12 gap-y-12 md:gap-y-24">
                {products.map((product, idx) => {
                    // Create asymmetric feel by adding different top margins/offsets based on index (Desktop only)
                    const isEven = idx % 2 === 0;
                    const isThird = (idx + 1) % 3 === 0;

                    let offsetClass = "";
                    if (isEven && !isThird) offsetClass = "md:mt-12";
                    if (isThird) offsetClass = "lg:mt-24";

                    return (
                        <div key={product.id} className={offsetClass}>
                            <ShopProductCard product={product} index={idx} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
