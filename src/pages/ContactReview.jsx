import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Star, MessageSquare, User } from 'lucide-react';
import api from '../api/axios'; // Backend se connect karne ke liye axios import kiya

function ContactReview() {
  const [activeTab, setActiveTab] = useState('contact');
  
  // Form States
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [reviewForm, setReviewForm] = useState({ name: '', product: '', rating: 0, message: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleContactChange = (e) => setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  const handleReviewChange = (e) => setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });

  // Contact Form Submit (Backend API)
  const submitContact = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', contactForm); // Backend ko data bheja
      alert('Message sent successfully! We will get back to you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // Review Form Submit (Backend API)
  const submitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      alert('Please select a star rating!');
      return;
    }
    setLoading(true);
    try {
      await api.post('/reviews', reviewForm); // Backend ko data bheja
      alert('Thank you for your review!');
      setReviewForm({ name: '', product: '', rating: 0, message: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500/30 focus:ring-1 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-sm font-medium text-gray-400 mb-2";

  return (
    <div className="min-h-screen bg-[#0f1117] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Get In Touch</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Have a question about your order or want to leave feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Quick Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl bg-[#161922] border border-white/5 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Email Us</p>
              <p className="text-sm font-medium text-white truncate">support@shopzone.com</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#161922] border border-white/5 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Call Us</p>
              <p className="text-sm font-medium text-white">+92 300 1234567</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#161922] border border-white/5 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Visit Us</p>
              <p className="text-sm font-medium text-white">Main Street, Karachi</p>
            </div>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[#161922] border border-white/5 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'contact' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" /> Contact Us
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'review' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4" /> Write a Review
            </button>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto rounded-2xl bg-[#161922] border border-white/5 p-6 sm:p-8">
          {activeTab === 'contact' ? (
            <form onSubmit={submitContact} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" name="name" value={contactForm.name} onChange={handleContactChange} required className={`${inputClass} pl-11`} placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="email" name="email" value={contactForm.email} onChange={handleContactChange} required className={`${inputClass} pl-11`} placeholder="john@example.com" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Subject *</label>
                <input type="text" name="subject" value={contactForm.subject} onChange={handleContactChange} required className={inputClass} placeholder="Order Issue / General Inquiry" />
              </div>
              <div>
                <label className={labelClass}>Message *</label>
                <textarea name="message" rows={5} value={contactForm.message} onChange={handleContactChange} required className={`${inputClass} resize-none`} placeholder="Write your message here..."></textarea>
              </div>
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                Send Message
              </button>
            </form>
          ) : (
            <form onSubmit={submitReview} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" name="name" value={reviewForm.name} onChange={handleReviewChange} required className={`${inputClass} pl-11`} placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Product Name *</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" name="product" value={reviewForm.product} onChange={handleReviewChange} required className={`${inputClass} pl-11`} placeholder="Nike Air Max 270" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className={labelClass}>Your Rating *</label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${(hoverRating || reviewForm.rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-700 text-gray-700'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Your Review *</label>
                <textarea name="message" rows={5} value={reviewForm.message} onChange={handleReviewChange} required className={`${inputClass} resize-none`} placeholder="Share your experience with this product..."></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Star className="w-4 h-4" />}
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactReview;