export default function ShopLoading() {
    return (
        <div className="min-h-screen bg-[#000000] text-white font-montserrat overflow-x-hidden">
            {/* Header skeleton */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-20 bg-white/5 rounded-full animate-pulse" />
                        <div className="h-8 w-8 bg-white/5 rounded-full animate-pulse" />
                    </div>
                </div>
            </header>

            {/* Hero skeleton */}
            <div className="relative h-[30vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="h-3 w-28 bg-[#D4AF37]/10 rounded mx-auto animate-pulse" />
                    <div className="h-10 w-64 bg-white/5 rounded mx-auto animate-pulse" />
                    <div className="h-4 w-48 bg-white/5 rounded mx-auto animate-pulse" />
                </div>
            </div>

            {/* Product grid skeleton */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div
                                className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse"
                                style={{ animationDelay: `${i * 100}ms` }}
                            />
                            <div className="space-y-2 px-1">
                                <div
                                    className="h-3 w-3/4 bg-white/5 rounded animate-pulse"
                                    style={{ animationDelay: `${i * 100 + 50}ms` }}
                                />
                                <div
                                    className="h-4 w-1/3 bg-[#D4AF37]/10 rounded animate-pulse"
                                    style={{ animationDelay: `${i * 100 + 100}ms` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
