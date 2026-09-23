import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ═══ Components ═══
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ═══ Jo pages HAIN unka import ═══
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductForm from './pages/AdminProductForm';
import AdminOrders from './pages/AdminOrders';

// ═══ Jo pages BANANI HAIN — banane ke baad comment hatao ═══
import About from './pages/About';
import Cart from './pages/Cart';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import OrderSuccess from './pages/OrderSuccess';
import ContactReview from './pages/ContactReview';
// import Register from './pages/Register';
// import ForgetPassword from './pages/ForgetPassword';
// import VerifyEmail from './pages/VerifyEmail';
// import ResendVerification from './pages/ResendVerification';

// ═══ ScrollToTop Component (Naya add kiya) ═══
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // Page change hone par scroll sab se upar jayega
  }, [pathname]);
  return null;
}

// ═══ Protected Route (login required) ═══
function ProtectedRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuth(true);
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
}

// ═══ Public Route (already login hai to home) ═══
function PublicRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuth(true);
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (<div className='min-h-screen flex items-center justify-center bg-surface'>
        <div className='w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (isAuth) {
    return <Navigate to='/' replace />;
  }

  return children;
}

function App() {
  return (
    <div className='min-h-screen bg-surface'>
      <ScrollToTop /> {/* Yahan component ko call kiya gaya hai */}
      <Navbar />
      <Routes>
        {/* ═══ Public Routes ═══ */}
        <Route path='/' element={<Home />} />
        <Route path='/products/:id' element={<ProductDetail />} />

        {/* ═══ Public Only — login hai to home ═══ */}
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/signup' element={<PublicRoute><Signup /></PublicRoute>} />

        {/* ═══ Protected Routes ═══ */}
        <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

        {/* ═══ Admin Routes ═══ */}
        <Route path='/admin' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path='/admin/add-product' element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
        <Route path='/admin/edit-product/:id' element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />

        {/* ═══ Naye routes — jab page banao import + route uncomment karo ═══ */}
        <Route path='/about' element={<About />} /> 
        <Route path='/products' element={<Products />} /> 
        <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} /> 
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} /> 
        <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} /> 
        <Route path='/order-success' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/contact" element={<ContactReview />} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
        {/* <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} /> */}
        {/* <Route path='/forgot-password' element={<ForgetPassword />} /> */}
        {/* <Route path='/verify-email/:token' element={<VerifyEmail />} /> */}
        {/* <Route path='/resend-verification' element={<ResendVerification />} /> */}

        {/* ═══ Fallback ═══ */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}

export default App;