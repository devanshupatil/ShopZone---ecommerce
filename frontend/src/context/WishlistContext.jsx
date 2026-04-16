import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

const getInitialWishlist = () => {
    try {
        const saved = localStorage.getItem('shopzone-wishlist');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(getInitialWishlist);

    useEffect(() => {
        localStorage.setItem('shopzone-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (productId) => {
        setWishlist((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const isWishlisted = (productId) => wishlist.includes(productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);
