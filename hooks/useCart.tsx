"use client";

import { useState, useEffect, createContext, useContext } from 'react';

export interface Product {
    id: string;
    name: string;
    price: number;
    price_50ml?: number;
    price_100ml?: number;
    image_url: string;
    description?: string;
    stock: number;
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize: '50ml' | '100ml';
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, size: '50ml' | '100ml', quantity: number) => void;
    removeFromCart: (productId: string, size: '50ml' | '100ml') => void;
    updateQuantity: (productId: string, size: '50ml' | '100ml', quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setCartOpen] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('gazzali_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e);
            }
        }
    }, []);

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('gazzali_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, size: '50ml' | '100ml', quantity: number) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id && item.selectedSize === size);
            if (existing) {
                return prev.map((item) =>
                    (item.id === product.id && item.selectedSize === size)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // Use the correct price based on size
            const activePrice = size === '50ml' ? (product.price_50ml || product.price) : (product.price_100ml || product.price);
            return [...prev, { ...product, price: activePrice, quantity, selectedSize: size }];
        });
    };

    const removeFromCart = (productId: string, size: '50ml' | '100ml') => {
        setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === size)));
    };

    const updateQuantity = (productId: string, size: '50ml' | '100ml', quantity: number) => {
        if (quantity < 1) return;
        setCart((prev) =>
            prev.map((item) => (item.id === productId && item.selectedSize === size ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const toggleCart = () => setCartOpen(!isCartOpen);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            isCartOpen,
            setCartOpen,
            toggleCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
