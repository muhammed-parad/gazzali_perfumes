"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import { Loader2, Menu, X } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        async function checkAuth() {
            if (pathname === "/admin/login") {
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/admin/login");
                return;
            }

            // Check role
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (profileError || !profile || profile.role !== 'admin') {
                console.warn("Admin access denied. Profile error or not an admin.", profileError);
                await supabase.auth.signOut();
                router.push("/admin/login?error=admin_required");
                return;
            }

            setAuthorized(true);
            setLoading(false);
        }

        checkAuth();
    }, [router, pathname]);

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-matte-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
            </div>
        );
    }

    if (!authorized) return null;

    return (
        <div className="min-h-screen bg-matte-black text-white flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-6 border-b border-white/5 bg-[#0B0B0B] sticky top-0 z-[55]">
                <div className="font-serif text-xl tracking-[0.4em] text-[#D4AF37] uppercase">Gazzali</div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 -mr-2 text-misty-grey hover:text-white transition-colors"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 p-6 lg:p-10 lg:ml-64 animate-fade-in">
                {children}
            </main>
        </div>
    );
}
