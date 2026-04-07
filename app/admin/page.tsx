"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, Clock, CheckCircle, TrendingUp, Package } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        totalRevenue: 0,
        totalProducts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            const { data: orders } = await supabase.from('orders').select('status, total_price');
            const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

            if (orders) {
                const totalOrders = orders.length;
                const pendingOrders = orders.filter(o => o.status === 'pending').length;
                const confirmedOrders = orders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).length;
                const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_price), 0);

                setStats({
                    totalOrders,
                    pendingOrders,
                    confirmedOrders,
                    totalRevenue,
                    totalProducts: productsCount || 0
                });
            }
            setLoading(false);
        }

        fetchStats();
    }, []);

    const statCards = [
        { name: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
        { name: "Pending", value: stats.pendingOrders, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { name: "Confirmed", value: stats.confirmedOrders, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
        { name: "Revenue (QAR)", value: stats.totalRevenue.toFixed(2), icon: TrendingUp, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" },
        { name: "Products", value: stats.totalProducts, icon: Package, color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-serif tracking-widest text-[#D4AF37] uppercase">Dashboard</h1>
                <p className="text-misty-grey/60 text-xs uppercase tracking-widest">Business Overview & Insights</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-white/20 transition-all group">
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-misty-grey/40 text-[10px] uppercase tracking-widest font-bold">{stat.name}</p>
                            <h3 className="text-2xl font-serif text-white group-hover:text-[#D4AF37] transition-colors">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                    <h3 className="text-lg font-serif text-white tracking-wider">Operational Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-misty-grey">Store Status</span>
                            <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Active</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-misty-grey">Payment Gateway</span>
                            <span className="text-[#D4AF37] font-bold uppercase tracking-widest text-[10px]">COD Only</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-misty-grey">Delivery Range</span>
                            <span className="text-white font-bold uppercase tracking-widest text-[10px]">Qatar Only</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-4">
                    <TrendingUp className="w-12 h-12 text-[#D4AF37]" />
                    <div className="space-y-1">
                        <h4 className="text-white font-serif text-xl">Quick Tip</h4>
                        <p className="text-misty-grey/60 text-sm max-w-xs">Confirm orders on WhatsApp as soon as possible to ensure fast delivery and customer satisfaction.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
