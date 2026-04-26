import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPreviewPage from './pages/OrderPreviewPage';
import OrderHistory from './pages/OrderHistory';
import WarrantyPage from './pages/WarrantyPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import SupportPage from './pages/SupportPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import { CartProvider } from './lib/CartContext';

function App() {
  const [filters, setFilters] = useState({ query: '', brand: '', oem: '' });

  return (
    <CartProvider>
      <Layout filters={filters} onFiltersChange={setFilters}>
        <Routes>
          <Route path="/" element={<HomePage filters={filters} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-preview" element={<OrderPreviewPage />} />
          <Route path="/rendeléseim" element={<OrderHistory />} />
          <Route path="/garancia" element={<WarrantyPage />} />
          <Route path="/szallitas" element={<ShippingPage />} />
          <Route path="/visszakuldes" element={<ReturnsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
        </Routes>
      </Layout>
    </CartProvider>
  );
}

export default App;
