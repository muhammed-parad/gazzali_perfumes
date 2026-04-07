"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Box, Package, Image as ImageIcon, Loader2, X, Save } from "lucide-react";

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        image_url: "",
        description: "",
        stock: "0"
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching products:', error);
        else setProducts(data || []);
        setLoading(false);
    }

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                image_url: product.image_url || "",
                description: product.description || "",
                stock: product.stock.toString()
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                price: "",
                image_url: "",
                description: "",
                stock: "0"
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            image_url: formData.image_url,
            description: formData.description,
            stock: parseInt(formData.stock)
        };

        try {
            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', editingProduct.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert(payload);
                if (error) throw error;
            }

            fetchProducts();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving product:', err);
            alert('Failed to save product. Check console for details.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) console.error('Error deleting product:', error);
        else fetchProducts();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
                <p className="text-misty-grey uppercase tracking-widest text-xs">Loading Products...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-serif tracking-widest text-[#D4AF37] uppercase">Products</h1>
                    <p className="text-misty-grey/60 text-xs uppercase tracking-widest">Manage your fragrance inventory</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#D4AF37] text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center space-x-3 hover:bg-white transition-all transform active:scale-[0.98] shadow-xl"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#D4AF37]/30 transition-all group flex flex-col">
                        <div className="aspect-[4/5] relative overflow-hidden bg-black/40">
                            <img
                                src={product.image_url || "/images/others/bottles.png"}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                                <button
                                    onClick={() => handleOpenModal(product)}
                                    className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-[#D4AF37] hover:text-black transition-all"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border ${product.stock > 0 ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-red-500/20 text-red-400 border-red-500/20"
                                    }`}>
                                    {product.stock} in stock
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-white font-serif text-lg tracking-wide line-clamp-1 group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                                <p className="text-[#D4AF37] font-bold text-xl mt-1">{product.price} <small className="text-[10px] uppercase font-normal ml-1">QAR</small></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="py-24 text-center space-y-4">
                    <Box className="w-16 h-16 text-white/5 mx-auto" />
                    <p className="text-misty-grey/40 uppercase tracking-widest text-xs">No products in inventory</p>
                </div>
            )}

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#131313] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl animate-modal-enter">
                        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
                            <h2 className="text-2xl font-serif text-[#D4AF37] tracking-wider uppercase">
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-white/5 rounded-full text-misty-grey hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold ml-1">Product Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Royal Oud"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold ml-1">Price (QAR)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold ml-1">Image URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="text"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://example.com/image.png"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold ml-1">Stock Quantity</label>
                                    <div className="relative">
                                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            required
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            placeholder="0"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold ml-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell us about this fragrance..."
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-sm resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#D4AF37] text-black font-bold py-5 rounded-2xl uppercase tracking-[0.3em] text-xs hover:bg-white transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl mt-4"
                            >
                                {submitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>{editingProduct ? "Update Changes" : "Create Product"}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
