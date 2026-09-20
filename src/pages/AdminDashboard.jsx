import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import api from '../api/axios';
import {
  Trash2, Edit, Plus, Package, ShoppingBag,
  DollarSign, AlertTriangle, BarChart3, Eye,
  Search, LayoutDashboard, Zap, X, Menu
} from 'lucide-react';

function AdminDashboard() {
  const { user, isAuthenticated } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.products || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    finally { setDeleting(null); }
  };

  const totalValue = products.reduce((s, p) => s + p.price * (p.stock || 0), 0);
  const categories = [...new Set(products.map(p => p.category))];
  const lowStock = products.filter(p => p.stock <= 5);
  const recentProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
        <div className="text-center p-6">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <Link to="/" className="text-indigo-400 text-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex justify-center">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Main Container - Centered */}
      <div className="w-full max-w-[1440px] flex min-h-screen relative">

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#161922] border-r border-white/5 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto lg:sticky lg:top-0 lg:h-screen shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold text-white tracking-wide">ShopZone</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <Link to="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-medium">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/admin/add-product" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Add Product
              </Link>
              <Link to="/products" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                <Eye className="w-4 h-4" /> View Store
              </Link>
              {/* Orders Link Added Here */}
              <Link to="/admin/orders" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                <Package className="w-4 h-4" /> Orders
              </Link>

              <div className="pt-4 mt-4 border-t border-white/5">
                <p className="px-3 pb-2 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Stats</p>
                <div className="px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-gray-400">Products</span><span className="text-white font-semibold">{products.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Categories</span><span className="text-white font-semibold">{categories.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Low Stock</span><span className={`font-semibold ${lowStock.length ? 'text-amber-400' : 'text-emerald-400'}`}>{lowStock.length}</span></div>
                </div>
              </div>
            </nav>

            <div className="p-3 border-t border-white/5 shrink-0">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Wrapper */}
        <main className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-[#0f1117]/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-white">Dashboard</h2>
                <p className="text-xs text-gray-400 hidden sm:block">Welcome back, {user?.name?.split(' ')[0]}</p>
              </div>
            </div>
            <Link to="/admin/add-product" className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all shadow-lg shadow-indigo-500/10">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span>
            </Link>
          </header>

          {/* Centered Main Content Area */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full mx-auto flex-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Package, label: 'Products', value: products.length, color: 'indigo' },
                { icon: DollarSign, label: 'Value', value: `Rs ${(totalValue / 1000).toFixed(0)}K`, color: 'emerald' },
                { icon: BarChart3, label: 'Categories', value: categories.length, color: 'purple' },
                { icon: AlertTriangle, label: 'Low Stock', value: lowStock.length, color: 'amber' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-[#161922] border border-white/5 p-4 lg:p-5 hover:border-white/10 transition-all">
                  <div className={`w-9 h-9 rounded-lg bg-${s.color}-500/10 flex items-center justify-center mb-3`}>
                    <s.icon className={`w-5 h-5 text-${s.color}-400`} />
                  </div>
                  <p className="text-xl lg:text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Grid Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Products */}
              <div className="lg:col-span-2 rounded-xl bg-[#161922] border border-white/5 overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Recent Products</h3>
                  <Link to="/admin/add-product" className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1 font-medium transition-colors">
                    Add <Plus className="w-3 h-3" />
                  </Link>
                </div>

                {recentProducts.length === 0 ? (
                  <div className="py-12 text-center my-auto"><ShoppingBag className="w-8 h-8 text-gray-700 mx-auto mb-2" /><p className="text-gray-500 text-sm">No products yet</p></div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {recentProducts.map((p) => (
                      <div key={p._id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                        <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover border border-white/5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-400">{p.category}</span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs font-semibold text-white">Rs {p.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Link to={`/admin/edit-product/${p._id}`} className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"><Edit className="w-4 h-4" /></Link>
                          <button onClick={() => deleteProduct(p._id, p.name)} disabled={deleting === p._id} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            {deleting === p._id ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="rounded-xl bg-[#161922] border border-white/5 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">Categories</h3>
                </div>
                <div className="p-5 space-y-4">
                  {categories.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No categories</p>
                  ) : categories.map((cat) => {
                    const count = products.filter(p => p.category === cat).length;
                    const pct = Math.round((count / products.length) * 100);
                    const colors = ['from-indigo-500 to-blue-500', 'from-emerald-500 to-teal-500', 'from-purple-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-red-500 to-rose-500', 'from-cyan-500 to-sky-500'];
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs font-medium mb-1.5"><span className="text-gray-300">{cat}</span><span className="text-gray-500">{count}</span></div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${colors[categories.indexOf(cat) % colors.length]} rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl bg-[#161922] border border-white/5 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">All Products</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{filteredProducts.length} items total</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500/50 transition-colors" />
                </div>
              </div>

              {loading ? (
                <div className="py-16 flex justify-center"><div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-12 text-center px-4">
                  <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No products found</p>
                  {!searchTerm && <Link to="/admin/add-product" className="inline-flex items-center gap-1.5 bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-medium mt-3"><Plus className="w-3.5 h-3.5" /> Add Product</Link>}
                </div>
              ) : (
                <>
                  <div className="sm:hidden p-3 space-y-2.5">
                    {filteredProducts.map((p) => (
                      <div key={p._id} className="bg-[#1a1d27] rounded-lg p-3 border border-white/5">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover border border-white/5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{p.name}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{p.category}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-bold text-white">Rs {p.price.toLocaleString()}</span>
                              <span className={`text-[11px] font-medium ${p.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>{p.stock} in stock</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 pt-2.5 border-t border-white/5">
                          <Link to={`/admin/edit-product/${p._id}`} className="flex-1 text-center py-1.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-medium">Edit</Link>
                          <button onClick={() => deleteProduct(p._id, p.name)} disabled={deleting === p._id} className="flex-1 text-center py-1.5 rounded-md bg-red-500/10 text-red-400 text-xs font-medium">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          <th className="px-6 py-3.5">Product</th>
                          <th className="px-6 py-3.5">Category</th>
                          <th className="px-6 py-3.5">Price</th>
                          <th className="px-6 py-3.5">Stock</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {filteredProducts.map((p) => (
                          <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-white/5 shrink-0" />
                                <span className="font-medium text-white truncate max-w-[200px] lg:max-w-[300px]">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-400">{p.category}</span>
                            </td>
                            <td className="px-6 py-3.5 font-semibold text-white">Rs {p.price.toLocaleString()}</td>
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${p.stock <= 0 ? 'bg-red-500' : p.stock <= 5 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                <span className="text-gray-300 font-medium">{p.stock}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Link to={`/admin/edit-product/${p._id}`} className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"><Edit className="w-4 h-4" /></Link>
                                <button onClick={() => deleteProduct(p._id, p.name)} disabled={deleting === p._id} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                  {deleting === p._id ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            <p className="text-center text-[11px] text-gray-600 pt-2 pb-4">ShopZone Admin Dashboard</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;