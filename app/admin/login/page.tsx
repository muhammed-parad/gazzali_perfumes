"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Check if user is admin
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profileError || !profile) {
                await supabase.auth.signOut();
                throw new Error("Admin profile not found. If you just signed up, ensure you ran the setup SQL and manually set your role in the 'user_profiles' table.");
            }

            if (profile.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error("Access denied. Your account role is '" + profile.role + "', but 'admin' is required.");
            }

            router.push("/admin");
        } catch (err: any) {
            setError(err.message || "Invalid login credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-matte-black flex flex-col items-center justify-center p-6 text-white selection:bg-gold-accent-1/30">
            <Link href="/" className="absolute top-10 left-10 flex items-center space-x-2 text-misty-grey hover:text-white transition-colors group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Back to Site</span>
            </Link>

            <div className="w-full max-w-md space-y-12 animate-fade-in">
                <div className="text-center space-y-4">
                    <div className="font-serif text-3xl tracking-[0.5em] text-[#D4AF37] uppercase">Gazzali</div>
                    <p className="text-misty-grey/60 uppercase tracking-[0.3em] text-[10px]">Admin Portal</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@gazzali.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-sm placeholder:text-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-sm placeholder:text-white/10"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-medium text-center">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full bg-[#D4AF37] text-black font-bold py-5 rounded-2xl uppercase tracking-[0.3em] text-xs hover:bg-white transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <span>Authorize Login</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
