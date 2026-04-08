"use client";

import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Loader2, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        area: "",
    });

    // Areas in Qatar
    const areas = [
        "Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Al Daayen", "Al Shamal", "Umm Salal", "Al Shahaniya", "Lusail", "The Pearl"
    ].sort();

    useEffect(() => {
        if (cart.length === 0 && !isSubmitting) {
            router.push("/shop");
        }
    }, [cart, router, isSubmitting]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.fullName || !formData.phone || !formData.address || !formData.area) {
            setError("Please fill in all required fields.");
            return false;
        }
        const phoneRegex = /^[0-9+]{8,15}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError("Please enter a valid WhatsApp number.");
            return false;
        }
        return true;
    };

    const generateWhatsAppMessage = (orderId: string, items: any[]) => {
        const itemsText = items.map(item => `• ${item.name} (${item.selectedSize}) (x${item.quantity})`).join('\n');

        const message = `Hello Misk Gazzali Team,\n\nI just placed an order in your Digital Boutique:\n\nOrder ID: ${orderId.split('-')[0].toUpperCase()}\nCustomer: ${formData.fullName}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.area}\n\nOrder Details:\n${itemsText}\n\nTotal: ${totalPrice} QAR\nPayment: Cash on Delivery\n\nPlease confirm my order. Thank you!`;

        return encodeURIComponent(message);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Stock check
            const { data: productsData, error: stockFetchError } = await supabase
                .from('products')
                .select('id, stock, name')
                .in('id', cart.map(item => item.id));

            if (stockFetchError) throw stockFetchError;

            for (const item of cart) {
                const product = productsData?.find(p => p.id === item.id);
                if (!product || product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product?.name || 'one of the items'}.`);
                }
            }

            // 2. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    area: formData.area,
                    payment_type: 'cod',
                    status: 'pending',
                    total_price: totalPrice
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 3. Create Order Items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                size: item.selectedSize
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 4. Reduce Stock
            for (const item of cart) {
                const product = productsData?.find(p => p.id === item.id);
                if (product) {
                    await supabase
                        .from('products')
                        .update({ stock: product.stock - item.quantity })
                        .eq('id', item.id);
                }
            }

            // 5. Generate WhatsApp URL and Redirect
            const whatsappMsg = generateWhatsAppMessage(order.id, cart);
            const whatsappUrl = `https://wa.me/97431697979?text=${whatsappMsg}`;

            // 6. Success Cleanup
            clearCart();

            // Show a brief success state before redirecting
            setTimeout(() => {
                window.location.href = whatsappUrl;
            }, 1500);

        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || "An unexpected error occurred. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0 && !isSubmitting) return null;

    return (
        <div className="min-h-screen bg-matte-black text-white selection:bg-gold-accent-1/30">
            {/* Header */}
            <header className="p-6 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-30">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/shop" className="flex items-center space-x-2 text-misty-grey hover:text-white transition-colors group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Shop</span>
                    </Link>
                    <h1 className="font-serif text-xl tracking-[0.3em] text-[#D4AF37] uppercase">Checkout</h1>
                    <div className="w-24"></div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Order Form */}
                    <div className="space-y-10 animate-fade-in-left">
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-serif text-white">Shipping Details</h2>
                            <p className="text-misty-grey/60 text-sm uppercase tracking-widest">Only Cash on Delivery available in Qatar</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Full Name *</label>
                                    <input
                                        required
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="e.g. Abdullah Ahmed"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors text-white placeholder:text-white/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">WhatsApp Number *</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+974 0000 0000"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors text-white placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Email (Optional)</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors text-white placeholder:text-white/20"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Delivery Area *</label>
                                    <select
                                        required
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors text-white appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled className="bg-matte-black">Select your area</option>
                                        {areas.map(area => (
                                            <option key={area} value={area} className="bg-matte-black">{area}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Full Address *</label>
                                    <input
                                        required
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Bldg/Street/Zone"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors text-white placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#D4AF37] text-black font-bold py-5 rounded-full uppercase tracking-[0.3em] hover:bg-white transition-all duration-500 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Ordering...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span>Place Order & Confirm on WhatsApp</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <Truck className="w-6 h-6 text-[#D4AF37]" />
                                <div className="text-[10px] uppercase tracking-widest text-misty-grey font-bold">Free Fast Shipping</div>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                                <div className="text-[10px] uppercase tracking-widest text-misty-grey font-bold">Secure COD Payment</div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-32 h-fit space-y-8 animate-fade-in-right">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
                            <h3 className="text-xl font-serif text-[#D4AF37] border-b border-white/10 pb-4">Order Summary</h3>

                            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                                                <img
                                                    src={item.image_url || "/images/others/bottles.png"}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-white text-sm font-medium line-clamp-1">{item.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-misty-grey/60 text-xs">Qty: {item.quantity}</p>
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-white/40 uppercase tracking-tighter">{item.selectedSize}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-white text-sm font-medium">{item.price * item.quantity} QAR</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-misty-grey/60 text-xs uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>{totalPrice} QAR</span>
                                </div>
                                <div className="flex justify-between text-misty-grey/60 text-xs uppercase tracking-widest">
                                    <span>Delivery</span>
                                    <span className="text-green-500 font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between text-[#D4AF37] text-xl font-serif pt-4 border-t border-white/5">
                                    <span>Total Amount</span>
                                    <span>{totalPrice} QAR</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
