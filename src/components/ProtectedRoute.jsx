import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useStore();

  // Wait until loading is done (auto-login check)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;