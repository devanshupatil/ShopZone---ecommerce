import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const badgeStyles = {
    HOT: 'bg-primary-container text-on-primary-container',
    NEW: 'bg-blue-600 text-white',
    SALE: 'bg-red-600 text-white',
};

function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(product.id);

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');
    const emptyStars = '☆'.repeat(5 - Math.ceil(product.rating));

    return (
        <div className="group bg-surface-container-low rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,94,0,0.15)] hover:bg-surface-container-high border border-transparent hover:border-primary/20">
            {/* Image Area */}
            <div className="relative h-64 overflow-hidden">
                {product.badge && (
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <span
                            className={`${badgeStyles[product.badge] || badgeStyles.HOT} text-[10px] font-black px-3 py-1 rounded-full uppercase`}
                        >
                            {product.badge}
                        </span>
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 z-10 text-white/50 hover:text-primary transition-colors"
                >
                    <span
                        className="material-symbols-outlined"
                        style={wishlisted ? { fontVariationSettings: "'FILL' 1", color: '#ff5e00' } : {}}
                    >
                        favorite
                    </span>
                </button>

                <Link to={`/product/${product.id}`}>
                    {product.image ? (
                        <img
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            src={product.image}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center">
                            <span className="text-7xl transition-transform duration-500 group-hover:scale-110">
                                {product.emoji}
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Info */}
            <div className="p-6">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">
                    {product.category}
                </p>
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-headline font-bold text-on-surface mb-2 hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price row */}
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-orange-500">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <>
                            <span className="text-slate-500 line-through text-sm">
                                {formatPrice(product.originalPrice)}
                            </span>
                            <span className="bg-emerald-500/15 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-lg">
                                {discount}% OFF
                            </span>
                        </>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-amber-400 text-sm">{stars}{emptyStars}</span>
                    <span className="text-xs text-slate-500">({product.reviews.toLocaleString()})</span>
                </div>

                <button
                    onClick={() => addToCart(product)}
                    className="w-full py-3 bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-bold rounded-xl transition-transform active:scale-95 hover:shadow-[0_8px_24px_rgba(255,94,0,0.25)]"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
