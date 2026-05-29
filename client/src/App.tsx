import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { SplashPage } from './pages/SplashPage';
import { MenuPage } from './pages/MenuPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrdersPage } from './pages/OrdersPage';
import { AboutPage } from './pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderTrackingPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
