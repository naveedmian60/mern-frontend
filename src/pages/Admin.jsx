import { useState, useEffect, useRef } from 'react';
import {
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  X,
  Loader,
  Search,
  LayoutDashboard,
  Upload,
  Image as ImageIcon,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import api from '../api/axios';

// ── Tabs ──────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
];

// ── Overview Cards ───────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl bg-white border border-zinc-100 p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

// ── Image Preview / Upload ──────────────────────────────────
function ImageUploadField({ currentImage, file, onFileChange, onRemovePreview }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    onFileChange(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleRemove = () => {
    setPreview(null);
    onRemovePreview();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-600 mb-1.5">Product Image</label>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-zinc-200 group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-full bg-white/90 text-red-500 hover:bg-white transition-all shadow-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="absolute bottom-2 right-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-zinc-600 hover:text-primary transition-all shadow-sm"
            >
              <Upload size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? 'border-accent bg-accent/5'
              : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'
          }`}
        >
          <ImageIcon size={28} className="text-zinc-300 mb-2" />
          <p className="text-xs text-muted font-medium">Click or drag image here</p>
          <p className="text-[10px] text-zinc-400 mt-1">JPG, PNG, WebP — Max 5MB</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}

// ── Product Modal ──────────────────────────────────────────
function ProductModal({ product, onClose, onSave, saving }) {
  const isEdit = Boolean(product?._id);
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price || '',
    stock: product?.stock || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image || null);
  const [existingImage] = useState(product?.image || '');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (file) => setImageFile(file);

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ form, imageFile, existingImage }, product?._id);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-primary">{isEdit ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Product name"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-primary placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Product description..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-primary placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                placeholder="e.g. Shoes"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-primary placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Price ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-primary placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-primary placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
          </div>

          <ImageUploadField
            currentImage={product?.image || ''}
            file={imageFile}
            onFileChange={handleImageChange}
            onRemovePreview={handleRemoveImage}
          />

          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
            <AlertCircle size={16} className="text-blue-500 flex-shrink-0" />
            <p className="text-[11px] text-blue-600 leading-relaxed">
              {isEdit
                ? 'Leave image empty to keep the current one. Upload a new image to replace it.'
                : 'Image will be uploaded to Cloudinary via the backend.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-zinc-800 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader size={16} className="animate-spin" />
                {isEdit ? 'Saving...' : 'Uploading...'}
              </>
            ) : isEdit ? (
              'Save Changes'
            ) : (
              'Add Product'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────
function ConfirmModal({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
        <p className="text-sm text-muted mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-primary hover:bg-zinc-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader size={16} className="animate-spin" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order Detail Modal ──────────────────────────────────
function OrderDetailModal({ order, onClose }) {
  const items = order.orderItems || order.items || [];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-primary">Order #{order._id?.slice(-8)}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-zinc-50">
              <p className="text-[10px] text-muted uppercase tracking-wider">Customer</p>
              <p className="font-medium text-primary">{order.user?.name || 'N/A'}</p>
              <p className="text-xs text-muted">{order.user?.email || '—'}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50">
              <p className="text-[10px] text-muted uppercase tracking-wider">Status</p>
              <p className="font-medium text-primary">{order.status || 'Pending'}</p>
              <p className="text-xs text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Shipping Address</p>
            <p className="text-sm text-primary">{order.shippingAddress?.address || 'N/A'}</p>
            <p className="text-xs text-muted">
              {order.shippingAddress?.city || ''}{order.shippingAddress?.city && ', '}{order.shippingAddress?.postalCode || ''}
              {order.shippingAddress?.phone && ` — ${order.shippingAddress.phone}`}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Items</p>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-primary">{item.name || 'Item'}</p>
                      <p className="text-xs text-muted">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-3 flex justify-between">
            <span className="font-semibold text-primary">Total</span>
            <span className="font-bold text-lg text-primary">
              ${order.totalPrice?.toFixed(2) || order.totalAmount?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────
export default function Admin() {
  const { auth } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, userRes, orderRes] = await Promise.all([
        api.get('/products').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] })),
        api.get('/orders').catch(() => ({ data: [] })),
      ]);

      const prods = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.products || prodRes.data || []);
      const usrs = Array.isArray(userRes.data) ? userRes.data : (userRes.data.users || userRes.data || []);
      const ords = Array.isArray(orderRes.data) ? orderRes.data : (orderRes.data.orders || orderRes.data || []);

      setProducts(prods);
      setUsers(usrs);
      setOrders(ords);

      const revenue = ords.reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0);
      setStats({
        totalUsers: usrs.length,
        totalProducts: prods.length,
        totalOrders: ords.length,
        totalRevenue: revenue,
      });
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Product CRUD — uses FormData for Cloudinary upload.single('image')
  const handleSaveProduct = async ({ form, imageFile, existingImage }, id) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      // Only append image if a new file was selected
      if (imageFile) {
        formData.append('image', imageFile);
      }
      // For PUT (edit), also send existing image URL so backend can keep it if no new image
      if (id && !imageFile && existingImage) {
        formData.append('existingImage', existingImage);
      }

      if (id) {
        await api.put(`/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      await fetchAll();
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    setActionLoading(true);
    try {
      await api.delete(`/products/${id}`);
      await fetchAll();
      setDeleteTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setActionLoading(true);
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted text-sm mt-1">Welcome back, {auth?.name || 'Admin'}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-zinc-100/80 w-fit mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-zinc-500 hover:text-primary'
              }`}
            >
              <tab.icon size={15} strokeWidth={1.8} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={28} className="animate-spin text-accent" />
          </div>
        ) : (
          <>
            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-50 text-blue-600" />
                  <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="bg-purple-50 text-purple-600" />
                  <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="bg-amber-50 text-amber-600" />
                  <StatCard
                    icon={DollarSign}
                    label="Total Revenue"
                    value={`$${stats.totalRevenue.toFixed(2)}`}
                    color="bg-green-50 text-green-600"
                  />
                </div>

                {/* Recent Orders */}
                <div className="rounded-2xl bg-white border border-zinc-100 p-6">
                  <h3 className="text-lg font-bold text-primary mb-4">Recent Orders</h3>
                  {orders.length === 0 ? (
                    <p className="text-sm text-muted">No orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0 cursor-pointer hover:bg-zinc-50/50 rounded-lg px-2 -mx-2 transition-colors"
                          onClick={() => setOrderDetail(order)}
                        >
                          <div>
                            <span className="text-sm font-medium text-primary">#{order._id?.slice(-8)}</span>
                            <p className="text-xs text-muted">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm text-primary">
                              ${order.totalPrice?.toFixed(2) || order.totalAmount?.toFixed(2) || '0.00'}
                            </span>
                            <Eye size={14} className="text-zinc-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Products Tab ── */}
            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-primary">Product Management</h3>
                  <button
                    onClick={() => setModal('add')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-lg shadow-primary/20"
                  >
                    <Plus size={15} />
                    Add Product
                  </button>
                </div>

                <div className="rounded-2xl bg-white border border-zinc-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-100">
                          <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Product</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Price</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Stock</th>
                          <th className="text-right px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p._id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image || '/placeholder-product.jpg'}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <span className="font-medium text-primary truncate max-w-[200px]">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted capitalize">{p.category || '—'}</td>
                            <td className="px-6 py-4 font-medium text-primary">${p.price?.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                p.stock > 10 ? 'bg-green-50 text-green-700' : p.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                              }`}>
                                {p.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setModal(p)}
                                  className="p-2 rounded-lg text-zinc-400 hover:text-accent hover:bg-accent/5 transition-all"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(p)}
                                  disabled={actionLoading}
                                  className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {products.length === 0 && (
                    <p className="text-center py-12 text-sm text-muted">No products yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* ── Users Tab ── */}
            {activeTab === 'users' && (
              <div className="rounded-2xl bg-white border border-zinc-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100">
                        <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">User</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Email</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Role</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-primary">{u.name}</td>
                          <td className="px-6 py-4 text-muted">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-zinc-100 text-zinc-600'
                            }`}>
                              {u.role || 'customer'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {users.length === 0 && (
                  <p className="text-center py-12 text-sm text-muted">No users found.</p>
                )}
              </div>
            )}

            {/* ── Orders Tab ── */}
            {activeTab === 'orders' && (
              <div className="rounded-2xl bg-white border border-zinc-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100">
                        <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Order ID</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                        <th className="text-right px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Total</th>
                        <th className="text-right px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => {
                        const statusColorMap = {
                          Processing: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                          Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
                          Delivered: 'bg-green-50 text-green-700 border-green-200',
                          Cancelled: 'bg-red-50 text-red-700 border-red-200',
                          Pending: 'bg-zinc-50 text-zinc-600 border-zinc-200',
                        };
                        const sc = statusColorMap[o.status] || statusColorMap.Pending;
                        return (
                          <tr key={o._id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-primary">#{o._id?.slice(-8) || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-primary">{o.user?.name || 'N/A'}</p>
                              <p className="text-xs text-muted">{o.user?.email || '—'}</p>
                            </td>
                            <td className="px-6 py-4 text-muted">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={o.status || 'Pending'}
                                onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                                disabled={actionLoading}
                                className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${sc} bg-transparent cursor-pointer focus:outline-none`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-primary">
                              ${o.totalPrice?.toFixed(2) || o.totalAmount?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => setOrderDetail(o)}
                                className="p-2 rounded-lg text-zinc-400 hover:text-accent hover:bg-accent/5 transition-all"
                              >
                                <Eye size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {orders.length === 0 && (
                  <p className="text-center py-12 text-sm text-muted">No orders yet.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {modal !== null && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSaveProduct}
          saving={saving}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={() => handleDeleteProduct(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}

      {/* Order Detail Modal */}
      {orderDetail && (
        <OrderDetailModal
          order={orderDetail}
          onClose={() => setOrderDetail(null)}
        />
      )}
    </div>
  );
}
