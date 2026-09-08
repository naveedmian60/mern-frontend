import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useStore();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex">
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 overflow-hidden">
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[100px]" />
                <div className="relative z-10 flex flex-col justify-center px-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm w-fit mb-8">
                        <Sparkles size={14} className="text-accent-light" />
                        <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Join us</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
                        Create your
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 to-accent-light bg-clip-text text-transparent">account</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                        Join thousands of happy customers. Get exclusive access to deals, track your orders, and build your wishlist.
                    </p>
                    <div className="mt-12 space-y-4">
                        {['Curated product recommendations', 'Real-time order tracking', 'Exclusive member discounts'].map((f) => (
                            <div key={f} className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                    <ArrowRight size={12} className="text-accent-light" />
                                </div>
                                <span className="text-sm text-zinc-400">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center"><span className="text-white font-bold text-sm">S</span></div>
                            <span className="text-lg font-semibold text-primary">StoreX</span>
                        </Link>
                    </div>

                    <h2 className="text-2xl font-bold text-primary mb-1">Create an account</h2>
                    <p className="text-muted text-sm mb-8">Fill in the details below to get started</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-zinc-200 bg-white text-sm text-primary placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-zinc-200 bg-white text-sm text-primary placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Min. 6 characters" className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-zinc-200 bg-white text-sm text-primary placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                            </div>
                        </div>
                        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}
                        <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary text-cyan-300 text-sm font-semibold hover:bg-zinc-800 transition-all disabled:opacity-60 shadow-lg shadow-primary/20">
                            {loading ? <Loader size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
                        </button>
                    </form>
                    <p className="text-center text-sm text-muted mt-8">
                        Already have an account? <Link to="/login" className="text-accent hover:text-accent-light font-medium transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}