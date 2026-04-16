const categories = [
    { key: 'all', label: 'All Products' },
    { key: 'electronics', label: 'Electronics' },
    { key: 'fashion', label: 'Fashion' },
    { key: 'home', label: 'Home Appliances' },
    { key: 'books', label: 'Books' },
];

export default function CategoryTabs({ active, onChange }) {
    return (
        <div className="flex items-center gap-10 border-b border-white/5 mb-10 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
                <button
                    key={cat.key}
                    onClick={() => onChange(cat.key)}
                    className={`font-medium pb-4 whitespace-nowrap transition-colors ${active === cat.key
                            ? 'text-orange-500 font-bold border-b-2 border-orange-500'
                            : 'text-slate-400 hover:text-slate-100'
                        }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}
