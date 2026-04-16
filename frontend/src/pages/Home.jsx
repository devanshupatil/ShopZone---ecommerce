import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import CategoryTabs from '../components/CategoryTabs';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';

export default function Home() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [rating, setRating] = useState('all');
    const [sortBy, setSortBy] = useState('featured');

    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        setLoading(true);
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch products:', err);
                setLoading(false);
            });
    }, []);

    // Apply all filters
    const filtered = products
        .filter((p) => {
            if (category !== 'all' && p.category !== category) return false;
            if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

            // Price range filter
            if (priceRange !== 'all') {
                if (priceRange === '0-500' && p.price > 500) return false;
                if (priceRange === '500-2000' && (p.price < 500 || p.price > 2000)) return false;
                if (priceRange === '2000-10000' && (p.price < 2000 || p.price > 10000)) return false;
                if (priceRange === '10000+' && p.price < 10000) return false;
            }

            // Rating filter
            if (rating !== 'all' && p.rating < Number(rating)) return false;

            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating-desc') return b.rating - a.rating;
            return 0; // featured = default order
        });

    return (
        <>
            <HeroSlider />

            <main className="max-w-7xl mx-auto px-8 -mt-12 relative z-20">
                <div className="bg-surface-container-low/80 backdrop-blur-xl p-8 rounded-3xl ghost-border shadow-2xl">
                    <CategoryTabs active={category} onChange={setCategory} />
                    <FilterBar
                        activePriceRange={priceRange}
                        onPriceChange={setPriceRange}
                        activeRating={rating}
                        onRatingChange={setRating}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        productCount={filtered.length}
                    />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pb-32">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-surface-container-low rounded-xl overflow-hidden animate-pulse"
                            >
                                <div className="h-64 bg-surface-container-high"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-3 bg-surface-container-high rounded w-1/3"></div>
                                    <div className="h-5 bg-surface-container-high rounded w-2/3"></div>
                                    <div className="h-6 bg-surface-container-high rounded w-1/2"></div>
                                    <div className="h-10 bg-surface-container-high rounded"></div>
                                </div>
                            </div>
                        ))
                        : filtered.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                </div>

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <h3 className="text-xl font-headline font-bold text-on-surface mb-2">
                            No products found
                        </h3>
                        <p className="text-on-surface-variant">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </main>
        </>
    );
}
