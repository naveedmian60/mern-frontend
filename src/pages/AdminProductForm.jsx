import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import api from '../api/axios';
import { ArrowLeft, Save, Upload, Image, Sparkles, X, ChevronDown } from 'lucide-react';

function AdminProductForm() {
  const { user, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', image: '', stock: '', brand: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  // Custom Dropdown State
  const [isCatOpen, setIsCatOpen] = useState(false);
  const catRef = useRef(null);
  const categories = ['Shoes', 'Electronics', 'Bags', 'Clothing', 'Accessories', 'Sports', 'Watches', 'Skincare', 'Books', 'Kitchen', 'Toys & Games', 'Jewelry', 'Other'];

  useEffect(() => {
    if (isEdit) fetchProduct();
  }, [id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchProduct = async () => {
    setFetchLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      const p = data.product;
      setForm({ name: p.name, price: p.price.toString(), description: p.description, category: p.category, image: p.image, stock: p.stock?.toString() || '0', brand: p.brand || '' });
      setImagePreview(p.image);
    } catch {
      alert('Failed to load product');
      navigate('/admin');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'image') {
      setImagePreview(e.target.value);
      setImageFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setForm({ ...form, image: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description || !form.category || (!form.image && !imageFile)) {
      alert('Please fill all required fields and provide an image');
      return;
    }
    setLoading(true);
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('name', form.name);
        formData.append('price', form.price);
        formData.append('description', form.description);
        formData.append('category', form.category);
        formData.append('stock', form.stock);
        formData.append('brand', form.brand);

        if (isEdit) {
          await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
          alert('Product updated!');
        } else {
          await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
          alert('Product added!');
        }
      } else {
        if (isEdit) { await api.put(`/products/${id}`, form); alert('Product updated!'); }
        else { await api.post('/products', form); alert('Product added!'); }
      }
      navigate('/admin');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
        <div className="text-center"><h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1></div>
      </div>
    );
  }

  if (isEdit && fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
        <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500/30 focus:ring-1 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-sm font-medium text-gray-400 mb-2";

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#161922]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
              </div>
              <p className="text-sm text-gray-500 mt-1">{isEdit ? 'Update product details below' : 'Fill in the details to create a new product'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload & Preview Card */}
          <div className="rounded-2xl bg-[#161922] border border-white/5 p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Image className="w-4 h-4 text-indigo-400" /> Product Image
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div>
                  <label className={labelClass}>Upload from PC (Recommended)</label>
                  <div className="flex items-center gap-2">
                    <label className={`flex-1 cursor-pointer ${inputClass} flex items-center gap-2 justify-center hover:bg-white/10`}>
                      <Upload className="w-4 h-4 text-indigo-400" />
                      <span>{imageFile ? imageFile.name : 'Choose File'}</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    {imageFile && (
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(form.image || ''); }} className="px-3 py-3 rounded-xl border border-white/10 text-red-400 text-sm hover:bg-red-500/10">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className={labelClass}>Or Image URL</label>
                  <div className="relative">
                    <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className={`${inputClass} pl-11`}
                      disabled={!!imageFile}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-40 shrink-0">
                <label className={labelClass}>Preview</label>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-32 rounded-xl object-cover border border-white/5" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-32 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-600">
                    <Image className="w-8 h-8 mb-1" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="rounded-2xl bg-[#161922] border border-white/5 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className={labelClass}>Product Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Wireless Bluetooth Headphones" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Price (Rs) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="2999" min="0" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="50" min="0" className={inputClass} />
              </div>
              
              {/* Custom Responsive Dropdown for PC & Mobile */}
              <div className="relative z-10">
                <label className={labelClass}>Category *</label>
                <div className="relative" ref={catRef}>
                  <button
                    type="button"
                    onClick={() => setIsCatOpen(!isCatOpen)}
                    className={`${inputClass} flex items-center justify-between text-left cursor-pointer w-full`}
                  >
                    <span className={form.category ? 'text-white' : 'text-gray-500'}>
                      {form.category || 'Select Category'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCatOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-[#1a1d27] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden">
                      {categories.map((cat) => (
                        <div
                          key={cat}
                          onClick={() => {
                            setForm({ ...form, category: cat });
                            setIsCatOpen(false);
                          }}
                          className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                            form.category === cat 
                              ? 'bg-indigo-500/20 text-indigo-400 font-medium' 
                              : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Brand</label>
                <input type="text" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Samsung, Nike" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl bg-[#161922] border border-white/5 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Description</h3>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Describe your product in detail..." className={`${inputClass} resize-none`} required />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            <button type="button" onClick={() => navigate('/admin')} className="px-8 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProductForm;