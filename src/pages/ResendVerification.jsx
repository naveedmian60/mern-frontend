import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { toast } from 'react-toastify';

const ResendVerification = () => {
  const { backendUrl } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/users/resend-verification`, { email });
      if (res.data.success) {
        setSent(true);
        toast.success('Verification email resent!');
      } else {
        toast.error(res.data.message || 'Failed to resend');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center">
          <p className="text-4xl mb-2">📧</p>
          <h1 className="text-xl font-bold text-white">Resend Verification</h1>
          <p className="text-sm text-indigo-200 mt-1">Get a new verification link</p>
        </div>

        <div className="p-8">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="your-email@example.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-indigo-200/50 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  'Send Verification Email'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <p className="text-3xl">✅</p>
              </div>
              <p className="text-sm text-gray-600">Verification email sent to <strong>{email}</strong></p>
              <p className="text-xs text-gray-400">Check your inbox and spam folder</p>
              <button
                onClick={() => setSent(false)}
                className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
              >
                Send to a different email
              </button>
            </div>
          )}

          <div className="mt-6 text-center space-y-2">
            <Link to="/login" className="block text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
