const priceRanges = [
    { key: 'all', label: 'All' },
    { key: '0-500', label: 'Under ₹500' },
    { key: '500-2000', label: '₹500 - ₹2,000' },
    { key: '2000-10000', label: '₹2,000 - ₹10,000' },
    { key: '10000+', label: '₹10,000+' },
];

const ratings = [
    { key: 'all', label: 'All' },
    { key: '4', label: '4★ & above' },
    { key: '3', label: '3★ & above' },
];

const sortOptions = [
    { key: 'featured', label: 'Featured' },
    { key: 'price-asc', label: 'Price: Low to High' },
    { key: 'price-desc', label: 'Price: High to Low' },
    { key: 'rating-desc', label: 'Rating: High to Low' },
];

export default function FilterBar({
    activePriceRange,
    onPriceChange,
    activeRating,
    onRatingChange,
    sortBy,
    onSortChange,
    productCount,
}) {
    return (
        <div className="flex flex-wrap items-center gap-8">
            {/* Price Range */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Price Range:</span>
                <div className="flex gap-2 flex-wrap">
                    {priceRanges.map((range) => (
                        <button
                            key={range.key}
                            onClick={() => onPriceChange(range.key)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activePriceRange === range.key
                                    ? 'bg-secondary-container/20 border border-primary text-primary'
                                    : 'bg-surface-container-high ghost-border text-slate-400 hover:bg-white/5'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Rating:</span>
                <div className="flex gap-2">
                    {ratings.map((r) => (
                        <button
                            key={r.key}
                            onClick={() => onRatingChange(r.key)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeRating === r.key
                                    ? 'bg-secondary-container/20 border border-primary text-primary'
                                    : 'bg-surface-container-high ghost-border text-slate-400 hover:bg-white/5'
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count + Sort */}
            <div className="flex items-center gap-4 ml-auto">
                <span className="text-sm text-slate-500">
                    Showing <span className="text-on-surface font-bold">{productCount}</span> products
                </span>
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="bg-surface-container-high border border-white/10 text-on-surface text-sm rounded-xl px-4 py-2 outline-none focus:border-primary/40 cursor-pointer"
                >
                    {sortOptions.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
