import { useCart } from '../lib/CartContext';
import { Link } from 'react-router-dom';

function OrderPreviewPage() {
  const { items, total } = useCart();

  return (
    <main className="container auth-page">
      <section className="auth-panel">
        <h2>Rendelés előnézet</h2>
        <p>Az alábbi rendelési összegzés a fizetés után készült.</p>
        {items.length > 0 ? (
          <div className="form-card">
            <ul className="order-preview-list">
              {items.map((item) => (
                <li key={item.id}>
                  <span>{item.name} x{item.quantity}</span>
                  <strong>{(item.quantity * item.price).toLocaleString()} Ft</strong>
                </li>
              ))}
            </ul>
            <div className="summary-total">
              <span>Összesen:</span>
              <strong>{total.toLocaleString()} Ft</strong>
            </div>
          </div>
        ) : (
          <p>A kosarad üres.</p>
        )}
        <Link to="/rendeléseim" className="primary-button">
          Rendeléseim megtekintése
        </Link>
      </section>
    </main>
  );
}

export default OrderPreviewPage;
