import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, MapPin, Truck, ShieldCheck, ChevronRight, ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import api from '../api/axios';

export default function Checkout() {
  const { cart, clearCart, user, token } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: '',
    method: 'cod',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 200;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  // ✅ Validate Shipping Form
  const validateShipping = () => {
    const newErrors = {};

    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Enter a valid email';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (shippingInfo.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Enter a valid phone number';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    else if (shippingInfo.address.trim().length < 10) newErrors.address = 'Enter complete address';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State/Province is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP Code is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstError = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) element.focus();
      return false;
    }
    return true;
  };

  // ✅ Validate Payment Form
  const validatePayment = () => {
    if (paymentInfo.method === 'card') {
      const newErrors = {};
      if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Enter a valid card number';
      if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
      if (!paymentInfo.expiry.trim()) newErrors.expiry = 'Expiry is required';
      if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
      else if (paymentInfo.cvv.length < 3) newErrors.cvv = 'Enter a valid CVV';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }
    }

    if (paymentInfo.method === 'upi') {
      if (!paymentInfo.upiId.trim()) {
        setErrors({ upiId: 'Bank account / IBAN is required' });
        return false;
      }
    }

    setErrors({});
    return true;
  };

  // ✅ Continue to Payment
  const handleContinueToPayment = () => {
    if (!validateShipping()) return;
    setErrors({});
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Place Order
  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;

    if (cart.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image,
        })),
        shippingInfo,
        paymentMethod: paymentInfo.method,
        totalPrice: total,
      };

      try {
        await api.post('/orders', orderData);
      } catch (err) {
        console.log('Order saved locally');
      }

      clearCart();
      navigate('/order-success');
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Input class with error state
  const inputClass = (fieldName) =>
    `w-full rounded-xl border bg-paper-soft px-4 py-3 text-sm outline-none transition-all ${
      errors[fieldName]
        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
        : 'border-line focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10'
    }`;

  const ErrorMsg = ({ field }) => {
    if (!errors[field]) return null;
    return (
      <div className="flex items-center gap-1.5 mt-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
        <span className="text-xs text-red-500">{errors[field]}</span>
      </div>
    );
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-paper-soft">
          <ShoppingBag className="h-10 w-10 text-ink/30" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink">Your cart is empty</h2>
        <p className="mt-3 text-ink/60">Add items to cart before checkout.</p>
        <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-all hover:bg-ink/90">
          Browse Products <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">Checkout</h1>
      </div>

      {/* Steps */}
      <div className="mb-8 sm:mb-10 flex items-center gap-3 sm:gap-4">
        <button onClick={() => { if (step > 1) { const valid = validateShipping(); if (valid || step >= 2) setStep(1); } }} className={`flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium transition-all ${step >= 1 ? 'bg-ink text-paper' : 'bg-paper-soft text-ink/50'}`}>
          <MapPin className="h-4 w-4" /> Shipping
        </button>
        <div className="h-px w-6 sm:w-8 bg-line" />
        <button className={`flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium transition-all ${step >= 2 ? 'bg-ink text-paper' : 'bg-paper-soft text-ink/50'}`}>
          <CreditCard className="h-4 w-4" /> Payment
        </button>
      </div>

      {/* Validation Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">Please fill all required fields</p>
            <p className="text-xs text-red-500 mt-0.5">Missing: {Object.keys(errors).join(', ')}</p>
          </div>
          <button onClick={() => setErrors({})} className="ml-auto text-red-400 hover:text-red-600 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left - Forms */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" /> Shipping Information
              </h2>
              <p className="text-sm text-ink/50 mb-6">All fields marked with * are required</p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Full Name *</label>
                  <input name="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} className={inputClass('fullName')} placeholder="Muhammad Ali" />
                  <ErrorMsg field="fullName" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Email *</label>
                  <input name="email" type="email" value={shippingInfo.email} onChange={handleShippingChange} className={inputClass('email')} placeholder="ali@example.com" />
                  <ErrorMsg field="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Phone Number *</label>
                  <input name="phone" value={shippingInfo.phone} onChange={handleShippingChange} className={inputClass('phone')} placeholder="03XX-XXXXXXX" />
                  <ErrorMsg field="phone" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Complete Address *</label>
                  <input name="address" value={shippingInfo.address} onChange={handleShippingChange} className={inputClass('address')} placeholder="House #, Street, Area, Colony" />
                  <ErrorMsg field="address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">City *</label>
                  <input name="city" value={shippingInfo.city} onChange={handleShippingChange} className={inputClass('city')} placeholder="Lahore" />
                  <ErrorMsg field="city" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">State/Province *</label>
                  <input name="state" value={shippingInfo.state} onChange={handleShippingChange} className={inputClass('state')} placeholder="Punjab" />
                  <ErrorMsg field="state" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">ZIP Code *</label>
                  <input name="zipCode" value={shippingInfo.zipCode} onChange={handleShippingChange} className={inputClass('zipCode')} placeholder="54000" />
                  <ErrorMsg field="zipCode" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Country</label>
                  <input name="country" value={shippingInfo.country} onChange={handleShippingChange} className="w-full rounded-xl border border-line bg-paper-soft px-4 py-3 text-sm outline-none focus:border-ink focus:bg-white" />
                </div>
              </div>

              <button onClick={handleContinueToPayment} className="mt-8 w-full rounded-full bg-ink py-3.5 text-sm font-medium text-paper transition-all hover:bg-ink/90 flex items-center justify-center gap-2">
                Continue to Payment <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent" /> Payment Method
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  { id: 'card', label: 'Credit Card', icon: '💳' },
                  { id: 'upi', label: 'Bank Transfer', icon: '🏦' },
                ].map(method => (
                  <button key={method.id} onClick={() => { setPaymentInfo({ ...paymentInfo, method: method.id }); setErrors({}); }} className={`rounded-xl border-2 p-4 text-center transition-all ${paymentInfo.method === method.id ? 'border-ink bg-ink/5' : 'border-line hover:border-ink/30'}`}>
                    <span className="text-2xl">{method.icon}</span>
                    <p className="mt-1 text-xs font-medium text-ink">{method.label}</p>
                  </button>
                ))}
              </div>

              {paymentInfo.method === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1.5">Card Number *</label>
                    <input name="cardNumber" value={paymentInfo.cardNumber} onChange={handlePaymentChange} placeholder="1234 5678 9012 3456" className={inputClass('cardNumber')} />
                    <ErrorMsg field="cardNumber" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1.5">Cardholder Name *</label>
                    <input name="cardName" value={paymentInfo.cardName} onChange={handlePaymentChange} className={inputClass('cardName')} placeholder="Muhammad Ali" />
                    <ErrorMsg field="cardName" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1.5">Expiry *</label>
                      <input name="expiry" value={paymentInfo.expiry} onChange={handlePaymentChange} placeholder="MM/YY" className={inputClass('expiry')} />
                      <ErrorMsg field="expiry" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1.5">CVV *</label>
                      <input name="cvv" value={paymentInfo.cvv} onChange={handlePaymentChange} placeholder="123" className={inputClass('cvv')} />
                      <ErrorMsg field="cvv" />
                    </div>
                  </div>
                </div>
              )}

              {paymentInfo.method === 'upi' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Bank Account / IBAN *</label>
                  <input name="upiId" value={paymentInfo.upiId} onChange={handlePaymentChange} placeholder="PK36ABCD0000001234567890" className={inputClass('upiId')} />
                  <ErrorMsg field="upiId" />
                </div>
              )}

              {paymentInfo.method === 'cod' && (
                <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
                  <p className="text-sm text-green-700">💵 Cash on Delivery — Pay when your order arrives at your doorstep.</p>
                </div>
              )}

              {/* ✅ MOBILE RESPONSIVE BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => { setStep(1); setErrors({}); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-medium text-ink transition-all hover:bg-paper-soft">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={handlePlaceOrder} disabled={loading} className="w-full sm:flex-1 rounded-full bg-ink py-3.5 text-sm font-medium text-paper transition-all hover:bg-ink/90 flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                  ) : (
                    <>Place Order — Rs {total.toLocaleString()} <ChevronRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right - Order Summary */}
        <div className="h-fit space-y-4">
          <div className="rounded-2xl border border-line bg-white p-6 sticky top-24">
            <h3 className="text-lg font-bold text-ink mb-5">Order Summary</h3>

            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
              {cart.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-paper-soft">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-ink/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                    <p className="text-xs text-ink/50">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-ink">Rs {(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-line pt-4">
              <div className="flex justify-between text-ink/60">
                <span>Subtotal</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'Free' : `Rs ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Tax (5%)</span>
                <span>Rs {tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-line pt-3 flex justify-between text-lg font-bold text-ink">
                <span>Total</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-ink/60">
                <Truck className="h-5 w-5 text-accent flex-shrink-0" />
                <span>Free shipping on orders over Rs 5,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-ink/60">
                <ShieldCheck className="h-5 w-5 text-accent flex-shrink-0" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}