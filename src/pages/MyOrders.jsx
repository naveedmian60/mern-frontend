import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useStore } from '../context/StoreContext';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function MyOrders() {
  const { user } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface pt-24">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">My Orders</h1>
        <p className="text-sm text-muted mb-6">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        {!user ? (
          <div className="text-center py-16">
            <p className="text-muted">Please login to see your orders</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted mb-4">No orders yet</p>
            <a href="/products" className="text-sm font-medium text-accent hover:underline">Browse Products</a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                {/* Order Header */}
                <button
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div>
                      <p className="text-xs text-muted">Order ID</p>
                      <p className="text-sm font-mono font-semibold text-primary">#{order._id.slice(-8)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Date</p>
                      <p className="text-sm text-primary">{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Total</p>
                      <p className="text-sm font-bold text-primary">Rs {order.totalPrice?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || statusColors.Pending}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-muted transition-transform ${expanded === order._id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded Content */}
                {expanded === order._id && (
                  <div className="border-t border-zinc-100 p-4 sm:p-5">
                    {/* Shipping Info (Backend field name fixed) */}
                    <div className="mb-4">
                      <p className="text-xs text-muted mb-1">Shipping To</p>
                      <p className="text-sm text-primary font-medium">{order.shippingInfo?.fullName}</p>
                      <p className="text-xs text-muted">{order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.zipCode}</p>
                      <p className="text-xs text-muted">{order.shippingInfo?.phone}</p>
                    </div>

                    {/* Items (Backend field 'quantity' fixed) */}
                    <div className="space-y-3">
                      {order.orderItems?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                            <p className="text-xs text-muted">Qty: {item.quantity} × Rs {item.price?.toLocaleString()}</p>
                          </div>
                          <p className="text-sm font-bold text-primary">Rs {(item.price * item.quantity)?.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown (Removed undefined fields) */}
                    <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
                      <div className="text-right space-y-1">
                        <p className="text-xs text-muted">Payment Method: {order.paymentMethod}</p>
                        <p className="text-base font-bold text-primary mt-1">Total: Rs {order.totalPrice?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}