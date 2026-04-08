"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, Search, Phone, Mail, MapPin, Loader2, Calendar, MoreVertical, CheckCircle2, Truck, Package, XCircle, Trash2 } from "lucide-react";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, products(name))')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching orders:', error);
        else setOrders(data || []);
        setLoading(false);
    }

    const updateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) console.error('Error updating status:', error);
        else {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        }
        setUpdatingId(null);
    };

    const handleDelete = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

        setUpdatingId(orderId);
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);

        if (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order. Check console.');
        } else {
            setOrders(prev => prev.filter(o => o.id !== orderId));
        }
        setUpdatingId(null);
    };

    const filteredOrders = orders.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case 'confirmed': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case 'shipped': return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case 'delivered': return "bg-green-500/10 text-green-500 border-green-500/20";
            case 'cancelled': return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-white/5 text-misty-grey border-white/10";
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
                <p className="text-misty-grey uppercase tracking-widest text-xs">Loading Orders...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-serif tracking-widest text-[#D4AF37] uppercase">Orders</h1>
                    <p className="text-misty-grey/60 text-xs uppercase tracking-widest">Manage customer requests and statuses</p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, phone or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-sm placeholder:text-white/10"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-misty-grey/60 font-bold whitespace-nowrap">
                            <th className="px-4 md:px-8 py-4 md:py-6">Customer / ID</th>
                            <th className="px-4 md:px-8 py-4 md:py-6">Items</th>
                            <th className="px-4 md:px-8 py-4 md:py-6">Status</th>
                            <th className="px-4 md:px-8 py-4 md:py-6">Total</th>
                            <th className="px-4 md:px-8 py-4 md:py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-4 md:px-8 py-6 md:py-8">
                                    <div className="space-y-3 min-w-[200px]">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium text-sm group-hover:text-[#D4AF37] transition-colors">{order.customer_name}</span>
                                            <span className="text-[10px] text-white/20 font-mono mt-1">{order.id.split('-')[0].toUpperCase()}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <a href={`tel:${order.phone}`} className="flex items-center space-x-1.5 text-[9px] md:text-[10px] text-misty-grey hover:text-[#D4AF37] transition-colors bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                                <Phone className="w-3 h-3" />
                                                <span>{order.phone}</span>
                                            </a>
                                            <div className="flex items-center space-x-1.5 text-[9px] md:text-[10px] text-misty-grey bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1.5 text-[9px] md:text-[10px] text-misty-grey/60">
                                            <MapPin className="w-3 h-3 text-[#D4AF37]/40" />
                                            <span className="line-clamp-1">{order.area}, {order.address}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 md:px-8 py-6 md:py-8">
                                    <div className="space-y-1.5 max-w-[150px] md:max-w-xs">
                                        {order.order_items.map((item: any, idx: number) => (
                                            <div key={idx} className="text-[11px] text-misty-grey flex justify-between gap-4">
                                                <div className="flex items-center gap-2 truncate">
                                                    <span className="truncate">{item.products?.name || 'Unknown Product'}</span>
                                                    {item.size && <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-white/40 uppercase tracking-tighter">{item.size}</span>}
                                                </div>
                                                <span className="text-white/40 shrink-0">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 md:px-8 py-6 md:py-8">
                                    <span className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 md:px-8 py-6 md:py-8">
                                    <div className="flex flex-col">
                                        <span className="text-[#D4AF37] font-serif text-base md:text-lg font-bold">{order.total_price}</span>
                                        <span className="text-[8px] text-misty-grey/40 uppercase tracking-tighter">QAR</span>
                                    </div>
                                </td>
                                <td className="px-4 md:px-8 py-6 md:py-8">
                                    <div className="flex justify-end gap-2">
                                        <div className="flex items-center space-x-0.5 bg-black/40 border border-white/5 rounded-xl p-0.5 md:p-1 overflow-hidden shrink-0">
                                            <button
                                                onClick={() => updateStatus(order.id, 'confirmed')}
                                                disabled={updatingId === order.id}
                                                className={clsx(
                                                    "p-2 rounded-lg transition-all",
                                                    order.status === 'confirmed' ? "bg-blue-500 text-white shadow-lg" : "text-white/20 hover:text-white hover:bg-white/5"
                                                )}
                                                title="Confirm Order"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(order.id, 'shipped')}
                                                disabled={updatingId === order.id}
                                                className={clsx(
                                                    "p-2 rounded-lg transition-all",
                                                    order.status === 'shipped' ? "bg-purple-500 text-white shadow-lg" : "text-white/20 hover:text-white hover:bg-white/5"
                                                )}
                                                title="Mark Shipped"
                                            >
                                                <Truck className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(order.id, 'delivered')}
                                                disabled={updatingId === order.id}
                                                className={clsx(
                                                    "p-2 rounded-lg transition-all",
                                                    order.status === 'delivered' ? "bg-green-500 text-white shadow-lg" : "text-white/20 hover:text-white hover:bg-white/5"
                                                )}
                                                title="Mark Delivered"
                                            >
                                                <Package className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(order.id, 'cancelled')}
                                                disabled={updatingId === order.id}
                                                className={clsx(
                                                    "p-2 rounded-lg transition-all",
                                                    order.status === 'cancelled' ? "bg-red-500 text-white shadow-lg" : "text-white/20 hover:text-white hover:bg-white/5"
                                                )}
                                                title="Cancel Order"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            disabled={updatingId === order.id}
                                            className="p-2 rounded-xl text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5 hover:border-red-500/20"
                                            title="Delete Order Permanently"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <ShoppingBag className="w-12 h-12 text-white/5 mx-auto" />
                        <p className="text-misty-grey/40 uppercase tracking-widest text-xs">No orders match your search</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
