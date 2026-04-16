import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

export default function Profile() {
    const { wishlist } = useWishlist();
    const { addToCart } = useCart();
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');

    // Form state
    const [profileData, setProfileData] = useState(() => {
        const saved = localStorage.getItem('shopzone-profile');
        return saved ? JSON.parse(saved) : { name: 'Devanshu', email: 'devanshu@shopzone.com', phone: '+91 98765 43210' };
    });

    const [addressData, setAddressData] = useState(() => {
        const saved = localStorage.getItem('shopzone-address');
        return saved ? JSON.parse(saved) : { street: '123 Nebula Drive, Tech District', city: 'New Delhi', postal: '110001', state: 'Delhi' };
    });

    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        if (wishlist.length > 0) {
            fetch('/api/products')
                .then((res) => res.json())
                .then((products) => {
                    setWishlistProducts(products.filter((p) => wishlist.includes(p.id)));
                });
        } else {
            setWishlistProducts([]);
        }
    }, [wishlist]);

    const tabs = [
        { key: 'profile', label: 'My Profile', icon: 'person' },
        { key: 'wishlist', label: 'Wishlist', icon: 'favorite', count: wishlist.length },
        { key: 'settings', label: 'Settings', icon: 'settings' },
    ];

    const handleSaveProfile = () => {
        localStorage.setItem('shopzone-profile', JSON.stringify(profileData));
        setSaveStatus('profile');
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleSaveAddress = () => {
        localStorage.setItem('shopzone-address', JSON.stringify(addressData));
        setSaveStatus('address');
        setTimeout(() => setSaveStatus(''), 2000);
    };

    return (
        <div className="pt-[80px] min-h-screen">
            <div className="max-w-6xl mx-auto px-8 py-12">
                {/* Profile Header */}
                <div className="glass-panel ghost-border rounded-3xl p-8 mb-10 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-container/10 blur-[100px] rounded-full"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-container to-orange-400 flex items-center justify-center text-4xl font-headline font-black text-on-primary-container shadow-[0_8px_30px_rgba(255,94,0,0.3)]">
                            D
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="font-headline font-black text-3xl text-on-surface tracking-tight">
                                {profileData.name}
                            </h1>
                            <p className="text-on-surface-variant text-sm mt-1">{profileData.email}</p>
                            <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
                                <span className="inline-flex items-center gap-1.5 bg-secondary-container/20 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        verified
                                    </span>
                                    Premium Member
                                </span>
                                <span className="text-on-surface-variant text-xs">Joined April 2026</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.key
                                ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_8px_20px_rgba(255,94,0,0.25)]'
                                : 'ghost-border text-on-surface-variant hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                            {tab.label}
                            {tab.count > 0 && (
                                <span className="bg-white/20 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="glass-panel ghost-border rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    badge
                                </span>
                                <h3 className="font-headline font-bold text-lg">Personal Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Full Name</label>
                                    <input
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary-container/40 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Email</label>
                                    <input
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary-container/40 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Phone</label>
                                    <input
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary-container/40 transition-all"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveProfile}
                                    className={`w-full py-3 font-bold rounded-xl text-sm transition-all mt-2 ${saveStatus === 'profile' ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-primary-container to-primary text-on-primary-container hover:scale-[1.02] active:scale-95'}`}
                                >
                                    {saveStatus === 'profile' ? 'Saved Successfully!' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="glass-panel ghost-border rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    location_on
                                </span>
                                <h3 className="font-headline font-bold text-lg">Shipping Address</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Street Address</label>
                                    <input
                                        value={addressData.street}
                                        onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                                        className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary-container/40 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">City</label>
                                        <input
                                            value={addressData.city}
                                            onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                                            className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary-container/40 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Postal Code</label>
                                        <input
                                            value={addressData.postal}
                                            onChange={(e) => setAddressData({ ...addressData, postal: e.target.value })}
                                            className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary-container/40 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">State</label>
                                    <input
                                        value={addressData.state}
                                        onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                                        className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary-container/40 transition-all"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveAddress}
                                    className={`w-full py-3 font-bold rounded-xl text-sm transition-all mt-2 ${saveStatus === 'address' ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-primary-container to-primary text-on-primary-container hover:scale-[1.02] active:scale-95'}`}
                                >
                                    {saveStatus === 'address' ? 'Address Updated!' : 'Update Address'}
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { icon: 'shopping_bag', label: 'Orders', value: '12', color: 'text-orange-400' },
                                { icon: 'favorite', label: 'Wishlist', value: wishlist.length.toString(), color: 'text-red-400' },
                                { icon: 'local_shipping', label: 'In Transit', value: '2', color: 'text-blue-400' },
                                { icon: 'star', label: 'Reviews', value: '8', color: 'text-amber-400' },
                            ].map((stat) => (
                                <div key={stat.label} className="glass-panel ghost-border rounded-2xl p-5 text-center">
                                    <span className={`material-symbols-outlined text-[28px] ${stat.color} mb-2`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {stat.icon}
                                    </span>
                                    <p className="font-headline font-black text-2xl text-on-surface">{stat.value}</p>
                                    <p className="text-xs text-on-surface-variant mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'wishlist' && (
                    <div>
                        {wishlistProducts.length === 0 ? (
                            <div className="glass-panel ghost-border rounded-2xl p-12 text-center">
                                <span className="text-6xl mb-4 block">💝</span>
                                <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Your wishlist is empty</h3>
                                <p className="text-on-surface-variant text-sm mb-6">Start adding products you love!</p>
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-bold rounded-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlistProducts.map((product) => (
                                    <div key={product.id} className="glass-panel ghost-border rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                        <Link to={`/product/${product.id}`}>
                                            <div className="h-40 bg-gradient-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{product.emoji}</span>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="p-5">
                                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{product.category}</p>
                                            <Link to={`/product/${product.id}`}>
                                                <h4 className="font-headline font-bold text-on-surface mb-2 hover:text-primary transition-colors">{product.name}</h4>
                                            </Link>
                                            <div className="flex items-baseline gap-2 mb-4">
                                                <span className="text-lg font-bold text-orange-400">{formatPrice(product.price)}</span>
                                                {product.originalPrice && (
                                                    <span className="text-xs text-on-surface-variant line-through">{formatPrice(product.originalPrice)}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-full py-2.5 bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-bold rounded-xl text-sm transition-transform active:scale-95"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-xl space-y-4">
                        {[
                            { icon: 'notifications', label: 'Push Notifications', desc: 'Get notified about deals & orders' },
                            { icon: 'dark_mode', label: 'Dark Mode', desc: 'Always on (ShopZone default)' },
                            { icon: 'language', label: 'Language', desc: 'English (India)' },
                            { icon: 'currency_rupee', label: 'Currency', desc: 'INR (₹)' },
                        ].map((setting) => (
                            <div key={setting.label} className="glass-panel ghost-border rounded-2xl p-5 flex items-center gap-4">
                                <span className="material-symbols-outlined text-orange-400 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {setting.icon}
                                </span>
                                <div className="flex-1">
                                    <p className="font-semibold text-on-surface text-sm">{setting.label}</p>
                                    <p className="text-xs text-on-surface-variant">{setting.desc}</p>
                                </div>
                                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                            </div>
                        ))}

                        <div className="pt-4">
                            <button className="w-full py-3 ghost-border rounded-xl text-red-400 font-bold text-sm hover:bg-red-500/10 transition-all">
                                Log Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
