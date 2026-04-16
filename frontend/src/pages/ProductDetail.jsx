import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedStorage, setSelectedStorage] = useState(0);
    const [activeThumb, setActiveThumb] = useState(0);
    const { addToCart } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setQty(1);
        setActiveThumb(0);
        window.scrollTo(0, 0);

        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);

                // Fetch related products from same category
                fetch(`/api/products?category=${data.category}`)
                    .then((res) => res.json())
                    .then((allCat) => {
                        setRelated(allCat.filter((p) => p.id !== data.id).slice(0, 4));
                    });
            })
            .catch((err) => {
                console.error('Failed to load product:', err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="pt-[80px] max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
                    <div className="h-[420px] bg-surface-container-high rounded-3xl"></div>
                    <div className="space-y-6">
                        <div className="h-6 bg-surface-container-high rounded w-1/4"></div>
                        <div className="h-10 bg-surface-container-high rounded w-3/4"></div>
                        <div className="h-24 bg-surface-container-high rounded"></div>
                        <div className="h-12 bg-surface-container-high rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-[80px] max-w-7xl mx-auto px-8 py-16 text-center">
                <span className="text-6xl mb-4 block">😕</span>
                <h2 className="text-2xl font-headline font-bold mb-2">Product Not Found</h2>
                <Link to="/" className="text-primary hover:underline">Go back to shop</Link>
            </div>
        );
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const wishlisted = isWishlisted(product.id);
    const thumbEmojis = [product.emoji, '🔋', '📷', '🎧'];
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    const categoryMap = {
        electronics: 'Electronics',
        fashion: 'Fashion',
        home: 'Home Appliances',
        books: 'Books',
    };

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) {
            addToCart(product);
        }
    };

    const handleBuyNow = () => {
        for (let i = 0; i < qty; i++) {
            addToCart(product);
        }
        navigate('/checkout');
    };

    return (
        <div className="pt-[64px]">
            {/* Breadcrumb */}
            <div className="px-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 py-4 text-xs text-on-surface-variant">
                    <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <Link to={`/?category=${product.category}`} className="hover:text-orange-400 transition-colors">
                        {categoryMap[product.category] || product.category}
                    </Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-on-surface">{product.name}</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* LEFT: Product Image */}
                    <div className="sticky top-[80px]">
                        <div className="ghost-border orange-glow glass-panel rounded-3xl flex items-center justify-center h-[420px] mb-4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-3xl" />
                            ) : (
                                <span className="text-[140px] select-none">{thumbEmojis[activeThumb]}</span>
                            )}
                            {product.badge && (
                                <div className="absolute top-4 left-4 bg-primary-container text-on-primary-container text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
                                    {product.badge}
                                </div>
                            )}
                            <button
                                onClick={() => toggleWishlist(product.id)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full ghost-border glass-panel flex items-center justify-center hover:bg-orange-500/10 transition-all group"
                            >
                                <span
                                    className="material-symbols-outlined text-on-surface-variant group-hover:text-orange-400 transition-colors"
                                    style={wishlisted ? { fontVariationSettings: "'FILL' 1", color: '#ff5e00' } : {}}
                                >
                                    favorite
                                </span>
                            </button>
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-3">
                            {thumbEmojis.map((emoji, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveThumb(i)}
                                    className={`ghost-border rounded-2xl w-20 h-20 flex items-center justify-center glass-panel border-2 transition-all hover:border-orange-500/60 ${activeThumb === i ? 'border-orange-500' : 'border-transparent'
                                        }`}
                                >
                                    <span className="text-3xl">{emoji}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="flex flex-col gap-6 pt-2">
                        {/* Category + Title */}
                        <div>
                            <span className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">
                                <span className="material-symbols-outlined text-[14px]">devices</span>
                                {categoryMap[product.category] || product.category}
                            </span>
                            <h1 className="font-headline font-black text-3xl md:text-4xl text-on-surface leading-tight tracking-tight mb-2">
                                {product.name}
                            </h1>
                            {/* Rating row */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-1">
                                    <span className="text-amber-400 text-base">{stars}</span>
                                    <span className="font-bold text-sm text-on-surface ml-1">{product.rating}</span>
                                </div>
                                <span className="text-on-surface-variant text-sm">
                                    {product.reviews.toLocaleString()} reviews
                                </span>
                                <span className="w-1 h-1 rounded-full bg-on-surface-variant/40"></span>
                                <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        check_circle
                                    </span>
                                    In Stock
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="ghost-border glass-panel rounded-2xl p-5">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="font-headline font-black text-4xl text-orange-400">
                                    {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-on-surface-variant text-lg line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                        <span className="bg-emerald-500/15 text-emerald-400 text-sm font-bold px-2.5 py-1 rounded-lg">
                                            {discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-on-surface-variant text-xs">
                                Inclusive of all taxes · Free delivery by{' '}
                                <span className="text-on-surface font-semibold">Tomorrow</span>
                            </p>
                        </div>

                        {/* Color options */}
                        {product.colors && (
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Color</p>
                                <div className="flex gap-3 flex-wrap">
                                    {product.colors.map((color, i) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(i)}
                                            className={`flex items-center gap-2 ghost-border px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${selectedColor === i
                                                ? 'glass-panel font-semibold border-orange-500 text-orange-400'
                                                : 'text-on-surface-variant hover:border-orange-500/40 border-transparent'
                                                }`}
                                        >
                                            <span className={`w-3 h-3 rounded-full inline-block ${i === 0 ? 'bg-slate-800 border border-white/20' :
                                                i === 1 ? 'bg-slate-300' : 'bg-amber-700'
                                                }`}></span>
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Storage options */}
                        {product.storage_options && (
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Storage</p>
                                <div className="flex gap-3 flex-wrap">
                                    {product.storage_options.map((storage, i) => (
                                        <button
                                            key={storage}
                                            onClick={() => setSelectedStorage(i)}
                                            className={`ghost-border px-5 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${selectedStorage === i
                                                ? 'glass-panel font-semibold border-orange-500 text-orange-400'
                                                : 'text-on-surface-variant hover:border-orange-500/40 border-transparent'
                                                }`}
                                        >
                                            {storage}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity + Buttons */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Quantity</p>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center ghost-border glass-panel rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="qty-btn w-10 h-10 flex items-center justify-center text-on-surface-variant transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">remove</span>
                                    </button>
                                    <span className="w-12 text-center font-bold text-on-surface text-sm">{qty}</span>
                                    <button
                                        onClick={() => setQty(qty + 1)}
                                        className="qty-btn w-10 h-10 flex items-center justify-center text-on-surface-variant transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 min-w-[160px] bg-gradient-to-r from-primary-container to-orange-400 text-on-primary-container font-bold py-3 rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,94,0,0.25)]"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 min-w-[140px] ghost-border glass-panel font-bold py-3 rounded-xl text-sm transition-all hover:bg-white/5 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Key Highlights */}
                        <div className="ghost-border glass-panel rounded-2xl p-5 grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-orange-400 text-[22px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    local_shipping
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-on-surface">Free Delivery</p>
                                    <p className="text-xs text-on-surface-variant">Tomorrow</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-orange-400 text-[22px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    autorenew
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-on-surface">7-Day Returns</p>
                                    <p className="text-xs text-on-surface-variant">Easy hassle-free returns</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-orange-400 text-[22px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    verified_user
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-on-surface">1 Year Warranty</p>
                                    <p className="text-xs text-on-surface-variant">Official warranty</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-orange-400 text-[22px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    payments
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-on-surface">EMI Available</p>
                                    <p className="text-xs text-on-surface-variant">Starting ₹{Math.round(product.price / 20).toLocaleString('en-IN')}/month</p>
                                </div>
                            </div>
                        </div>

                        {/* Specifications */}
                        {product.specs && (
                            <div>
                                <h3 className="font-headline font-bold text-lg mb-4">Specifications</h3>
                                <div className="ghost-border glass-panel rounded-2xl overflow-hidden divide-y divide-white/5">
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <div key={key} className="flex px-5 py-3.5 text-sm">
                                            <span className="text-on-surface-variant w-36 shrink-0">{key}</span>
                                            <span className="text-on-surface">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div className="mt-16">
                        <h2 className="font-headline font-bold text-xl mb-6">
                            You Might Also <span className="text-orange-400">Like</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {related.map((p) => (
                                <Link
                                    key={p.id}
                                    to={`/product/${p.id}`}
                                    className="group ghost-border bg-surface-container rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,94,0,0.12)] cursor-pointer"
                                >
                                    <div className="relative bg-gradient-to-br from-surface-container-high to-surface-container-lowest h-36 flex items-center justify-center">
                                        <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                                            {p.emoji}
                                        </span>
                                        {p.badge && (
                                            <span className={`absolute top-2 left-2 ${p.badge === 'HOT' ? 'bg-primary-container text-on-primary-container' :
                                                p.badge === 'NEW' ? 'bg-emerald-500 text-white' :
                                                    'bg-red-500 text-white'
                                                } text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase`}>
                                                {p.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-on-surface-variant text-[9px] font-bold uppercase tracking-widest mb-1">
                                            {categoryMap[p.category] || p.category}
                                        </p>
                                        <h3 className="font-headline font-bold text-xs text-on-surface mb-2 leading-snug">
                                            {p.name}
                                        </h3>
                                        <div className="flex items-baseline gap-1.5 mb-1">
                                            <span className="text-orange-400 font-black text-sm">{formatPrice(p.price)}</span>
                                            {p.originalPrice && (
                                                <span className="text-on-surface-variant text-[10px] line-through">
                                                    {formatPrice(p.originalPrice)}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-amber-400 text-[10px]">
                                            {'★'.repeat(Math.floor(p.rating))}{'☆'.repeat(5 - Math.floor(p.rating))}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
