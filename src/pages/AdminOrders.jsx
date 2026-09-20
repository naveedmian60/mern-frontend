import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck, CheckCircle, Clock, XCircle, Loader } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus, isPaid: newStatus === 'Delivered' ? true : o.isPaid } : o));
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Shipped': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'Processing': return <Loader className="w-3 h-3" />;
      case 'Shipped': return <Truck className="w-3 h-3" />;
      case 'Delivered': return <CheckCircle className="w-3 h-3" />;
      case 'Cancelled': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
        <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#161922]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Customer Orders</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {orders.length === 0 ? (
          <div className="rounded-2xl bg-[#161922] border border-white/5 p-12 text-center">
            <Package className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white">No Orders Yet</h3>
            <p className="text-sm text-gray-500 mt-1">When customers place orders, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl bg-[#161922] border border-white/5 overflow-hidden">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Order #{order._id.substring(0, 8)}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingStatus === order._id}
                      className="bg-[#1a1d27] border border-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="Pending" className="bg-[#161922]">Pending</option>
                      <option value="Processing" className="bg-[#161922]">Processing</option>
                      <option value="Shipped" className="bg-[#161922]">Shipped</option>
                      <option value="Delivered" className="bg-[#161922]">Delivered</option>
                      <option value="Cancelled" className="bg-[#161922]">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Order Body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5">
                  {/* Customer & Shipping Info */}
                  <div className="lg:col-span-1 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Customer</h4>
                      <p className="text-sm font-medium text-white">{order.shippingInfo.fullName}</p>
                      <p className="text-xs text-gray-400">{order.shippingInfo.email}</p>
                      <p className="text-xs text-gray-400">{order.shippingInfo.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Shipping Address</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {order.shippingInfo.address},<br />
                        {order.shippingInfo.city}, {order.shippingInfo.state} <br />
                        {order.shippingInfo.zipCode}, {order.shippingInfo.country}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Payment</h4>
                      <p className="text-xs text-gray-400 capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                      <p className={`text-xs font-medium ${order.isPaid ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {order.isPaid ? 'Paid' : 'Pending Payment'}
                      </p>
                    </div>
                  </div>

                  {/* Order Items & Total */}
                  <div className="lg:col-span-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-[#1a1d27] rounded-lg p-2.5">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover border border-white/5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × Rs {item.price.toLocaleString()}</p>
                          </div>
                          <p className="text-sm font-semibold text-white">Rs {(item.quantity * item.price).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-400">Total Amount</span>
                      <span className="text-xl font-bold text-white">Rs {order.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}