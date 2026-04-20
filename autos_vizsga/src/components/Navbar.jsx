import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/useAuth';

function Navbar({ filters, onFiltersChange }) {
  const { cartItemCount, toggleCart } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const updateFilter = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Kijelentkezési hiba:', error);
    }
  };

  return (
    <header className="header">
      <div className="container header-top">
        <div className="logo-block">
          <Link to="/">
            <h1>CarCore</h1>
          </Link>
        </div>

        <div className="header-right">
          <div className="toolbar search-bar">
            <input
              type="text"
              placeholder="Keresés név szerint..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
            />
            <input
              type="text"
              placeholder="Márka"
              value={filters.brand}
              onChange={(e) => updateFilter('brand', e.target.value)}
            />
            <input
              type="text"
              placeholder="OEM"
              value={filters.oem}
              onChange={(e) => updateFilter('oem', e.target.value)}
            />
          </div>
          <nav className="desktop-nav">
            {user ? (
              <button
                className="logout-btn"
                type="button"
                onClick={handleLogout}
              >
                Kijelentkezés
              </button>
            ) : (
              <>
                <Link to="/login">Bejelentkezés</Link>
                <Link to="/register">Regisztráció</Link>
              </>
            )}
          </nav>
          <button className="cart-btn" type="button" onClick={toggleCart}>
            <ShoppingCart size={18} /> Kosár ({cartItemCount})
          </button>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu container">
          <Link to="/">Főoldal</Link>
          <Link to="/garancia">Garancia</Link>
          <Link to="/szallitas">Szállítás</Link>
          {user ? (
            <button
              className="logout-btn"
              type="button"
              onClick={handleLogout}
            >
              Kijelentkezés
            </button>
          ) : (
            <>
              <Link to="/login">Bejelentkezés</Link>
              <Link to="/register">Regisztráció</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
