import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';

export default function Navbar() {
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/?search=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-md flex justify-between items-center px-8 py-4 max-w-full font-headline tracking-tight shadow-[0_20px_50px_rgba(255,94,0,0.1)]">
            <div className="flex items-center flex-1">
                <Link to="/" className="text-2xl font-black italic tracking-tighter text-orange-500">
                    ShopZone
                </Link>
            </div>

            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8 relative hidden sm:block">
                <input
                    className="w-full bg-surface-container-lowest border border-white/30 outline-none ring-0 focus:ring-0 focus:border-white/60 rounded-full py-2 px-6 text-sm placeholder-slate-500 transition-colors"
                    placeholder="Search revolutionary tech..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="absolute right-4 top-2 text-slate-500">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </form>

            <div className="flex items-center gap-6">
                <button className="text-slate-400 hover:text-orange-500 transition-colors relative sm:hidden">
                    <span className="material-symbols-outlined">search</span>
                </button>
                <Link to="/favourites" className="text-slate-400 hover:text-orange-500 transition-colors relative">
                    <span className="material-symbols-outlined">favorite</span>
                    {wishlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950">
                            {wishlist.length}
                        </span>
                    )}
                </Link>
                <Link
                    to="/checkout"
                    className="bg-primary-container text-on-primary-container p-2.5 rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all relative"
                >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-primary-container text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950">
                            {cartCount}
                        </span>
                    )}
                </Link>
                <Link to="/profile" className="text-slate-400 hover:text-slate-100 transition-colors">
                    <span className="material-symbols-outlined">account_circle</span>
                </Link>
            </div>
        </nav>
    );
}
