"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Box, LogOut, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Box },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={cn(
                "w-64 min-h-screen bg-[#0B0B0B] border-r border-white/10 p-6 flex flex-col fixed left-0 top-0 z-[70] transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="mb-10 px-4 flex justify-between items-center">
                    <div>
                        <div className="font-serif text-xl tracking-[0.4em] text-[#D4AF37] uppercase">Gazzali</div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-misty-grey/40 mt-1">Management</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center justify-between px-4 py-4 rounded-2xl transition-all group",
                                    isActive
                                        ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                                        : "text-misty-grey hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-[#D4AF37]" : "text-white/20 group-hover:text-white/40")} />
                                    <span className="text-sm font-medium tracking-wide">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-sm font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
