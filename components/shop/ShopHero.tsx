"use client";

import { motion } from "framer-motion";

export default function ShopHero() {
    return (
        <section className="relative h-[40vh] min-h-[300px] flex flex-col items-center justify-center bg-[#000000] overflow-hidden pt-20">
            <div className="text-center space-y-6 z-10 px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="font-playfair text-5xl md:text-7xl lg:text-8xl text-[#D4AF37] tracking-tight leading-none"
                >
                    Our Collection
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <p className="text-white text-xs md:text-sm font-montserrat tracking-[0.3em] font-light uppercase opacity-80">
                        Discover the perfect scent for every occasion
                    </p>

                    {/* Expanding Golden Underline */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 100 }}
                        transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
                        className="h-[2px] bg-[#D4AF37] rounded-full"
                    />
                </motion.div>
            </div>

            {/* Subtle background texture or gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_70%)] pointer-events-none" />
        </section>
    );
}
