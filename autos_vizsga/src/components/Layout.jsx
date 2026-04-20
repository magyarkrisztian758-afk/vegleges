import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

function Layout({ filters, onFiltersChange, children }) {
  return (
    <div className="app-shell">
      <Navbar filters={filters} onFiltersChange={onFiltersChange} />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
