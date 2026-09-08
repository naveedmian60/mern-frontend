import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const VerifyEmail = () => {
  const { token } = useParams();
  const { backendUrl } = useStore();
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // verifying | success | expired | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/users/verify-email/${token}`);

        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(res.data.message || 'Verification failed.');
        }
      } catch (err) {
        setStatus('expired');
        setMessage(err.response?.data?.message || 'Invalid or expired verification link.');
      }
    };

    if (token) verifyEmail();
  }, [token, backendUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className={`p-8 text-center ${
          status === 'success' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
          status === 'expired' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
          status === 'error' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
          'bg-gradient-to-br from-indigo-500 to-purple-600'
        }`}>
          {status === 'verifying' && (
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          )}
          {status === 'success' && <p className="text-5xl mb-2">✅</p>}
          {status === 'expired' && <p className="text-5xl mb-2">⏰</p>}
          {status === 'error' && <p className="text-5xl mb-2">❌</p>}

          <h1 className="text-xl font-bold text-white mt-3">
            {status === 'verifying' && 'Verifying...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'expired' && 'Link Expired'}
            {status === 'error' && 'Verification Failed'}
          </h1>
        </div>

        {/* Body */}
        <div className="p-8 text-center">
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>

          {status === 'success' && (
            <button
              onClick={() => navigate('/login')}
              className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-indigo-200/50 transition-all active:scale-[0.98]"
            >
              Go to Login
            </button>
          )}

          {status === 'expired' && (
            <div className="mt-6 space-y-3">
              <p className="text-xs text-gray-400">The verification link has expired. You can request a new one.</p>
              <Link
                to="/resend-verification"
                className="block w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-medium text-sm hover:shadow-lg transition-all text-center"
              >
                Resend Verification Email
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 space-y-3">
              <Link
                to="/signup"
                className="block w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium text-sm hover:shadow-lg transition-all text-center"
              >
                Sign Up Again
              </Link>
            </div>
          )}

          <Link to="/" className="inline-block mt-4 text-xs text-gray-400 hover:text-indigo-500 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
