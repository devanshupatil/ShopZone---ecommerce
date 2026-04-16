import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

export default function Checkout() {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const shipping = 0;
    const tax = Math.round(cartTotal * 0.18);
    const total = cartTotal + shipping + tax;

    const handleCheckout = () => {
        if (cart.items.length === 0) return;
        setOrderData({
            items: [...cart.items],
            subtotal: cartTotal,
            tax,
            total,
            orderId: 'SZ-' + Date.now().toString(36).toUpperCase(),
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        });
        setOrderPlaced(true);
        clearCart();
    };

    return (
        <div className="min-h-screen">
            {/* Distraction-Free Header */}
            <header className="fixed top-0 w-full z-50 bg-[#10131a]/60 backdrop-blur-md shadow-[0_20px_40px_-15px_rgba(255,94,0,0.15)]">
                <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors group">
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="font-medium">Back to Shopping</span>
                        </Link>
                    </div>
                    <div className="font-headline text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                        ShopZone
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-orange-500">lock</span>
                        <span className="text-xs font-bold tracking-widest uppercase">Secure Checkout</span>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Shipping Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        local_shipping
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight font-headline">Shipping Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-on-surface-variant ml-1">First Name</label>
                                    <input
                                        className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary-container/40 placeholder:text-surface-variant transition-all"
                                        placeholder="John"
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-on-surface-variant ml-1">Last Name</label>
                                    <input
                                        className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary-container/40 placeholder:text-surface-variant transition-all"
                                        placeholder="Doe"
                                        type="text"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-on-surface-variant ml-1">Street Address</label>
                                    <input
                                        className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary-container/40 placeholder:text-surface-variant transition-all"
                                        placeholder="123 Nebula Drive, Tech District"
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-on-surface-variant ml-1">City</label>
                                    <input
                                        className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary-container/40 placeholder:text-surface-variant transition-all"
                                        placeholder="Neo-Seoul"
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-on-surface-variant ml-1">Postal Code</label>
                                    <input
                                        className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary-container/40 placeholder:text-surface-variant transition-all"
                                        placeholder="10101"
                                        type="text"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <aside className="sticky top-32 glass-panel ghost-border rounded-xl p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden relative">
                            {/* Glow Ornament */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/10 blur-[80px] rounded-full"></div>

                            <h3 className="text-xl font-bold tracking-tight mb-8 relative z-10 font-headline">Order Summary</h3>

                            <div className="space-y-6 relative z-10">
                                {cart.items.length === 0 ? (
                                    <div className="text-center py-8">
                                        <span className="text-4xl mb-3 block">🛒</span>
                                        <p className="text-on-surface-variant text-sm">Your cart is empty</p>
                                        <Link to="/" className="text-primary text-sm hover:underline mt-2 inline-block">
                                            Continue Shopping
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        {cart.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="relative group">
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-highest flex items-center justify-center">
                                                        {item.image ? (
                                                            <img
                                                                alt={item.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                src={item.image}
                                                            />
                                                        ) : (
                                                            <span className="text-3xl">{item.emoji}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-on-surface text-sm">{item.name}</h4>
                                                    <p className="text-xs text-on-surface-variant">{item.category}</p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <div className="flex items-center ghost-border glass-panel rounded-lg overflow-hidden">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="qty-btn w-7 h-7 flex items-center justify-center text-on-surface-variant transition-all text-xs"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">remove</span>
                                                            </button>
                                                            <span className="w-8 text-center font-bold text-on-surface text-xs">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="qty-btn w-7 h-7 flex items-center justify-center text-on-surface-variant transition-all text-xs"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">add</span>
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-xs text-red-400 hover:text-red-300"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-primary text-sm">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}

                                        <div className="h-px bg-surface-variant/30 my-8"></div>

                                        {/* Calculations */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-on-surface-variant">Subtotal</span>
                                                <span className="font-medium">{formatPrice(cartTotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-on-surface-variant">Shipping</span>
                                                <span className="text-primary-fixed-dim">Free</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-on-surface-variant">Taxes (18% GST)</span>
                                                <span className="font-medium">{formatPrice(tax)}</span>
                                            </div>
                                            <div className="pt-6 flex justify-between items-end border-t border-surface-variant/30">
                                                <div>
                                                    <span className="text-xs uppercase tracking-widest text-on-surface-variant block mb-1">
                                                        Total Amount
                                                    </span>
                                                    <span className="text-3xl font-black text-on-surface tracking-tighter font-headline">
                                                        {formatPrice(total)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-secondary-container/20 px-3 py-1 rounded-full">
                                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                                                        Secure
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <button
                                            onClick={handleCheckout}
                                            className="w-full mt-8 py-5 rounded-xl bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-black tracking-widest text-sm shadow-[0_15px_40px_rgba(255,94,0,0.3)] hover:shadow-[0_20px_50px_rgba(255,94,0,0.5)] active:scale-95 transition-all duration-300"
                                        >
                                            SECURE CHECKOUT
                                        </button>
                                        <div className="flex items-center justify-center gap-2 pt-6">
                                            <span className="material-symbols-outlined text-surface-variant text-lg">shield</span>
                                            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                                                Encrypted SSL Transaction
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Order Confirmation */}
            {orderPlaced && orderData && (
                <section className="max-w-3xl mx-auto px-6 pb-20 animate-[fadeIn_0.5s_ease]">
                    <div className="glass-panel ghost-border rounded-2xl p-8 text-center mb-8">
                        <span className="text-6xl mb-4 block">🎉</span>
                        <h2 className="font-headline font-black text-3xl text-on-surface mb-2">Order Placed!</h2>
                        <p className="text-on-surface-variant mb-1">Thank you for your purchase</p>
                        <p className="text-xs text-on-surface-variant">
                            Order ID: <span className="text-primary font-bold">{orderData.orderId}</span> · {orderData.date}
                        </p>
                    </div>

                    <div className="ghost-border glass-panel rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5">
                            <h3 className="font-headline font-bold text-lg">Order Details</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {orderData.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                                    <div className="w-14 h-14 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <span className="text-2xl">{item.emoji}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-on-surface text-sm">{item.name}</h4>
                                        <p className="text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-primary text-sm">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 border-t border-white/5 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-on-surface-variant">Subtotal</span>
                                <span className="font-medium">{formatPrice(orderData.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-on-surface-variant">Shipping</span>
                                <span className="text-emerald-400">Free</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-on-surface-variant">Taxes (18% GST)</span>
                                <span className="font-medium">{formatPrice(orderData.tax)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-3 border-t border-white/5">
                                <span>Total Paid</span>
                                <span className="text-orange-400 font-headline font-black text-xl">{formatPrice(orderData.total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_8px_24px_rgba(255,94,0,0.25)]"
                        >
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                            Continue Shopping
                        </Link>
                    </div>

                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </section>
            )}

            {/* Footer */}
            <footer className="py-12 border-t border-surface-variant/10 text-center">
                <p className="text-xs text-surface-variant tracking-widest uppercase">
                    © 2026 SHOPZONE ECOSYSTEM. ALL RIGHTS RESERVED.
                </p>
            </footer>
        </div>
    );
}
