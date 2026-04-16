import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
    {
        badge: 'MEGA SALE',
        title: 'Upgrade Your',
        highlight: 'Tech Game',
        subtitle: 'Experience the next generation of high-performance peripherals and hardware. Engineered for precision, built for the elite.',
        product: { name: 'X-Pulse VR Gen 2', price: '₹44,999', originalPrice: '₹52,000', label: 'New Release' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXo6ZSYcTbMFjNO0Nz8Et6vQr1yUYaCsP7v_j0Dd74s890g7sA31MIbG5SQxbqWgqDwCIN25zb3R8g3eodSZJcxWYLxROES3WXMwwk3hMcHWOfDspvp6qoW6ap1iLEJaUMpLLM2L39sGDsrzlTB0Hirfd_rJY0ISyIjEzGDG9W5DvHB0eEeYRJrkRcfrOriE51PiB3gAE8nT0Hp4aMCGkcd71bbD3DldCrj2QPJomavUnq5Vog5tMP8_7I5chjEN8e9VL_tEZ_X0Fp',
    },
    {
        badge: 'FLASH DEAL',
        title: 'Unleash The',
        highlight: 'Power Within',
        subtitle: 'Premium gaming gear and accessories that redefine your setup. Dominate every arena with cutting-edge technology.',
        product: { name: 'RTX 5090 Kinetic', price: '₹1,59,999', originalPrice: '₹1,89,999', label: 'Best Seller' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa_K2LNtF7HPyIPhjq0aqJtebwP_HJRCDY5EX9A_hxeY9n-nIOXycgMo_WqbKZKBdNe6vd72dUUVXKjTtdXG9Iof0UCbkEVj7vN2bYT_tyZf4Hzo_DxllU9eSDPHQ5eHxQvzca5ZkJSrZUZX4Z0Ov71DutkJw7nfpzsdFQ3W20N54T4Oq8RnXVzvN0P-2RkAbdpIDN0Yo-qTDNv6h0j9CRpxzGgynubUPdvgSVcPXl_bUVcvhyzOKllRdVxm-HrPX13-wqafjHFTae',
    },
    {
        badge: 'LIMITED EDITION',
        title: 'Sound That',
        highlight: 'Moves You',
        subtitle: 'Immersive audio experiences with studio-grade headphones and speakers. Hear every detail, feel every beat.',
        product: { name: 'Sonic Vibe X-500', price: '₹24,999', originalPrice: '₹34,999', label: 'Trending' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0Md_bVjHt86duNFU-khHRk_lY-bOv3wkrv7t8NU0CKyjmd_qcSEzlT0UrK7Oy0XG1tYHtIiR4wvrH-PTeLygCSGwu7nfNZkT6c-gnEFemexGZbpkIvR3Pge5OgfbWhYUQNB-m0QLS-gJCyDwoyfNtxZ6VyGZ4rB1By3ACYwW40FeN5YB4rAYPbMlcWzoHwD-d2CGRL3BaJACILpZgk9j37RQ3mCg2hKuOPC0Ddvlj1OrwL1GtCzjR1yKTvGr1ZCSLJkLi6ITxhCMG',
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[current];

    return (
        <section className="mt-20 pt-24 pb-32 hero-gradient overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <div className="z-10" key={current}>
                    <span className="inline-flex items-center bg-secondary-container/20 text-primary font-bold text-xs px-4 py-1.5 rounded-full lume-dot mb-6 uppercase tracking-widest animate-[fadeIn_0.5s_ease]">
                        {slide.badge}
                    </span>
                    <h1 className="text-6xl lg:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] mb-8 tracking-tighter animate-[fadeIn_0.6s_ease]">
                        {slide.title} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-primary">
                            {slide.highlight}
                        </span>
                    </h1>
                    <p className="text-xl text-on-surface-variant mb-12 max-w-lg leading-relaxed animate-[fadeIn_0.7s_ease]">
                        {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-6 animate-[fadeIn_0.8s_ease]">
                        <Link
                            to="/"
                            className="px-10 py-4 bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-bold rounded-xl shadow-[0_10px_30px_rgba(255,94,0,0.3)] hover:scale-105 transition-all"
                        >
                            Shop Collection
                        </Link>
                        <button className="px-10 py-4 ghost-border bg-surface-variant/40 backdrop-blur-md text-primary font-bold rounded-xl hover:bg-surface-variant/60 transition-all">
                            View Deals
                        </button>
                    </div>
                </div>

                {/* Right: Floating Product Card */}
                <div className="relative group">
                    <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full"></div>
                    <div className="relative bg-surface-container-high/40 backdrop-blur-xl p-4 rounded-[2rem] ghost-border rotate-3 group-hover:rotate-0 transition-transform duration-700 shadow-2xl">
                        <img
                            alt={slide.product.name}
                            className="rounded-[1.5rem] w-full h-[450px] object-cover"
                            src={slide.image}
                        />
                        <div className="absolute -bottom-6 -left-6 bg-surface-container-highest p-6 rounded-2xl shadow-2xl ghost-border">
                            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">
                                {slide.product.label}
                            </p>
                            <p className="text-lg font-headline font-bold">{slide.product.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-orange-500 font-bold">{slide.product.price}</span>
                                <span className="text-slate-500 line-through text-sm">
                                    {slide.product.originalPrice}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide Dots */}
            <div className="flex justify-center gap-3 mt-12">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-3 h-3 rounded-full transition-all ${i === current
                                ? 'bg-primary-container scale-125 shadow-[0_0_10px_rgba(255,94,0,0.5)]'
                                : 'bg-slate-600 hover:bg-slate-500'
                            }`}
                    />
                ))}
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
}
