import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

export default function Favourites() {
    const { wishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            });
    }, []);

    const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

    const categoryMap = {
        electronics: 'Electronics',
        fashion: 'Fashion',
        home: 'Home Appliances',
        books: 'Books',
    };

    return (
        <div className="pt-[80px] min-h-screen">
            <div className="max-w-6xl mx-auto px-8 py-12">
                {/* Header */}
                <div className="flex items-center gap-3 mb-10">
                    <span className="material-symbols-outlined text-orange-400 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                    </span>
                    <div>
                        <h1 className="font-headline font-black text-3xl text-on-surface tracking-tight">
                            My Favourites
                        </h1>
                        <p className="text-on-surface-variant text-sm">
                            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="glass-panel ghost-border rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-48 bg-surface-container-high"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-3 bg-surface-container-high rounded w-1/3"></div>
                                    <div className="h-5 bg-surface-container-high rounded w-2/3"></div>
                                    <div className="h-10 bg-surface-container-high rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : wishlistProducts.length === 0 ? (
                    <div className="glass-panel ghost-border rounded-3xl p-16 text-center">
                        <span className="text-7xl mb-6 block">💝</span>
                        <h3 className="font-headline font-bold text-2xl text-on-surface mb-3">
                            No favourites yet
                        </h3>
                        <p className="text-on-surface-variant text-sm mb-8 max-w-md mx-auto">
                            Tap the heart icon on any product to save it here. Your favourites will be waiting for you!
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_8px_24px_rgba(255,94,0,0.25)]"
                        >
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistProducts.map((product) => {
                            const discount = product.originalPrice
                                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                : 0;
                            const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

                            return (
                                <div
                                    key={product.id}
                                    className="glass-panel ghost-border rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,94,0,0.12)]"
                                >
                                    {/* Image */}
                                    <div className="relative h-52 bg-gradient-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center overflow-hidden">
                                        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <span className="text-6xl group-hover:scale-110 transition-transform duration-500">
                                                    {product.emoji}
                                                </span>
                                            )}
                                        </Link>
                                        {product.badge && (
                                            <span className={`absolute top-3 left-3 ${product.badge === 'HOT' ? 'bg-primary-container text-on-primary-container' :
                                                    product.badge === 'NEW' ? 'bg-emerald-500 text-white' :
                                                        'bg-red-500 text-white'
                                                } text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider`}>
                                                {product.badge}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => toggleWishlist(product.id)}
                                            className="absolute top-3 right-3 w-9 h-9 rounded-full glass-panel ghost-border flex items-center justify-center hover:bg-red-500/20 transition-all"
                                        >
                                            <span
                                                className="material-symbols-outlined text-red-400 text-[20px]"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                favorite
                                            </span>
                                        </button>
                                    </div>

                                    {/* Details */}
                                    <div className="p-5">
                                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1.5">
                                            {categoryMap[product.category] || product.category}
                                        </p>
                                        <Link to={`/product/${product.id}`}>
                                            <h4 className="font-headline font-bold text-on-surface mb-2 hover:text-primary transition-colors leading-snug">
                                                {product.name}
                                            </h4>
                                        </Link>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-amber-400 text-xs">{stars}</span>
                                            <span className="text-on-surface-variant text-xs">
                                                ({product.reviews.toLocaleString()})
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-xl font-black text-orange-400 font-headline">
                                                {formatPrice(product.price)}
                                            </span>
                                            {product.originalPrice && (
                                                <>
                                                    <span className="text-xs text-on-surface-variant line-through">
                                                        {formatPrice(product.originalPrice)}
                                                    </span>
                                                    <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                                        {discount}% OFF
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="flex-1 py-2.5 bg-gradient-to-r from-primary-container to-orange-400 text-on-primary-container font-bold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(255,94,0,0.2)]"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                                Add to Cart
                                            </button>
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="ghost-border glass-panel py-2.5 px-4 rounded-xl text-sm font-medium transition-all hover:bg-white/5 flex items-center"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
