import { supabase } from "@/lib/supabase";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopHero from "@/components/shop/ShopHero";
import ShopProductGrid from "@/components/shop/ShopProductGrid";
import Link from "next/link";

export const revalidate = 60; // Revalidate every 60 seconds

async function getProducts(query?: string) {
    let supabaseQuery = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (query) {
        supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data || [];
}

export default async function ShopPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams.q;
    const products = await getProducts(query);

    return (
        <div className="min-h-screen bg-[#000000] text-white font-montserrat selection:bg-[#D4AF37]/30 overflow-x-hidden">
            {/* Boutique Header */}
            <ShopHeader />

            <main>
                {/* Boutique Hero Section */}
                <ShopHero />

                {/* Search Feedback */}
                {query && (
                    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center">
                        <p className="font-montserrat text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-black">
                            Search Results for:
                        </p>
                        <h2 className="font-playfair text-3xl md:text-5xl text-white mt-2 tracking-tight">
                            "{query}"
                        </h2>
                    </div>
                )}

                {/* Asymmetric Product Grid */}
                <ShopProductGrid products={products} />
            </main>

            {/* Luxurious Footer (Minimalist) */}
            <footer className="bg-black border-t border-white/5 py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="font-playfair text-2xl tracking-[0.4em] text-[#D4AF37] uppercase">
                            Misk Gazzali
                        </div>
                        <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-light">
                            © 2026 Gazzali Perfumes. Redefining Digital Luxury.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                        <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
                        <Link href="/shop" className="text-[#D4AF37]">The Collection</Link>
                        <a href="https://wa.me/97431697979" className="hover:text-[#25D366] transition-colors">Boutique WhatsApp</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
