import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center px-12 py-10 gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-slate-100 font-headline">ShopZone</h2>
                <p className="text-xs text-slate-500">
                    Precision engineered commerce for the digital era.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-sm">
                <Link to="/" className="text-slate-500 hover:text-orange-500 transition-colors">
                    Privacy Policy
                </Link>
                <Link to="/" className="text-slate-500 hover:text-orange-500 transition-colors">
                    Terms of Service
                </Link>
                <Link to="/" className="text-slate-500 hover:text-orange-500 transition-colors">
                    Shipping Info
                </Link>
                <Link to="/" className="text-slate-500 hover:text-orange-500 transition-colors">
                    Contact
                </Link>
            </div>
            <div className="text-slate-500 text-sm">© 2026 ShopZone Kinetic. All rights reserved.</div>
        </footer>
    );
}
