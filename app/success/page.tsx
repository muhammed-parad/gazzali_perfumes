"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Phone, ShoppingBag, Loader2, Home, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrderDetails() {
            if (!orderId) return;

            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (orderError) {
                console.error('Error fetching order:', orderError);
                setLoading(false);
                return;
            }

            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select('*, products(name)')
                .eq('order_id', orderId);

            if (itemsError) {
                console.error('Error fetching items:', itemsError);
            }

            setOrder(orderData);
            setItems(itemsData || []);
            setLoading(false);
        }

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
                <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold">Authenticating Order...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-6">
                <div className="bg-red-500/10 p-8 border border-red-500/20">
                    <ShoppingBag className="w-12 h-12 text-red-500" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-playfair text-white tracking-tight">Order Not Found</h2>
                    <p className="text-white/40 max-w-xs font-montserrat text-sm leading-relaxed uppercase tracking-widest">
                        We couldn't retrieve your order details at this moment.
                    </p>
                </div>
                <Link href="/" className="px-10 py-4 border border-white/20 text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all">
                    Return to Boutique
                </Link>
            </div>
        );
    }

    // WhatsApp Message Generation (Fixed & Robust)
    const itemsText = items.map(item => {
        const product = item.products;
        const productName = (Array.isArray(product) ? product[0]?.name : product?.name) || 'Exquisite Fragrance';
        return `• ${productName} (x${item.quantity})`;
    }).join('\n');

    const rawMessage = `Hello Misk Gazzali Team,\n\nI have just placed an order in your Digital Boutique:\n\nOrder ID: ${order.id.split('-')[0].toUpperCase()}\nCustomer: ${order.customer_name}\nTotal: ${order.total_price} QAR\n\nItems Ordered:\n${itemsText}\n\nPlease confirm my delivery. Thank you!`;

    const whatsappUrl = `https://wa.me/97431697979?text=${encodeURIComponent(rawMessage)}`;

    return (
        <div className="max-w-2xl mx-auto space-y-16 py-12 md:py-24">
            {/* Success Hero */}
            <div className="text-center space-y-8 px-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-[#D4AF37]/5 border border-[#D4AF37]/20 relative"
                >
                    <CheckCircle2 className="w-12 h-12 text-[#D4AF37]" />
                    <div className="absolute inset-0 bg-[#D4AF37] opacity-10 animate-ping" />
                </motion.div>

                <div className="space-y-4">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-6xl font-playfair text-[#D4AF37] tracking-tight leading-none"
                    >
                        Order Confirmed
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold"
                    >
                        Welcome to the Misk Gazzali Family
                    </motion.p>
                </div>
            </div>

            {/* Boutique Order Summary Card */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="bg-[#0A0A0A] border border-white/5 p-10 md:p-12 space-y-10 relative overflow-hidden"
            >
                <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-white/5 pb-10">
                    <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black">Boutique Reference</span>
                        <p className="text-white font-montserrat text-lg font-light tracking-[0.1em]">{order.id.split('-')[0].toUpperCase()}</p>
                    </div>
                    <div className="space-y-2 md:text-right">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black">Grand Total</span>
                        <p className="text-white text-3xl font-playfair">{order.total_price} <span className="text-[14px] font-montserrat opacity-40 ml-1">QAR</span></p>
                    </div>
                </div>

                <div className="space-y-6">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black">Your Selection</span>
                    <div className="grid gap-6">
                        {items.map((item, idx) => {
                            const product = item.products;
                            const productName = (Array.isArray(product) ? product[0]?.name : product?.name) || 'Exquisite Fragrance';
                            return (
                                <div key={idx} className="flex justify-between items-center group">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-1 h-1 bg-[#D4AF37]/40 group-hover:bg-[#D4AF37] transition-colors" />
                                        <p className="text-white font-playfair text-lg leading-none">{productName}</p>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <span className="text-white/20 font-montserrat text-xs tracking-widest">Qty: {item.quantity}</span>
                                        <span className="text-[#D4AF37]/60 font-montserrat text-[10px] font-black uppercase tracking-widest">COD</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                    <div className="bg-white/[0.02] border border-white/5 p-8 text-center space-y-8">
                        <p className="text-[11px] text-white/40 font-montserrat uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
                            To ensure priority processing of your bespoke selection, please confirm via our direct boutique WhatsApp.
                        </p>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center space-x-4 bg-[#25D366] text-white px-10 py-5 rounded-none font-montserrat font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#128C7E] transition-all transform hover:scale-[1.02] active:scale-[0.98] w-full"
                        >
                            <Phone className="w-4 h-4 fill-white" />
                            <span>Confirm Boutique Delivery</span>
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* Boutique Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
                <Link href="/" className="group flex items-center space-x-3 text-white/40 hover:text-white transition-colors py-4 px-8 border border-transparent hover:border-white/5 w-full sm:w-auto justify-center">
                    <Home className="w-4 h-4" />
                    <span className="text-[10px] font-montserrat font-black uppercase tracking-[0.3em]">Home</span>
                </Link>
                <Link href="/shop" className="group flex items-center space-x-3 bg-white text-black py-4 px-10 border border-white hover:bg-transparent hover:text-white transition-all w-full sm:w-auto justify-center">
                    <span className="text-[10px] font-montserrat font-black uppercase tracking-[0.3em]">Continue Exploring</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-[#D4AF37]/30">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                    <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
                    <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold">Initializing Boutique Experience...</p>
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
