import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../lib/CartContext';

function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('Rendelés feldolgozása...');

    // Szimulált rendelés leadás
    setTimeout(() => {
      setMessage('Rendelés sikeresen leadva!');
      clearCart();
      setTimeout(() => {
        navigate('/order-preview');
      }, 1000);
    }, 1000);
  };

  return (
    <main className="container checkout-page">
      <section className="checkout-grid">
        <div className="form-card">
          <h2>Szállítási adatok</h2>
          <form onSubmit={submit}>
            <label>
              Név
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Cím
              <input value={address} onChange={(e) => setAddress(e.target.value)} required />
            </label>
            <label>
              Város
              <input value={city} onChange={(e) => setCity(e.target.value)} required />
            </label>
            <label>
              Irányítószám
              <input value={postal} onChange={(e) => setPostal(e.target.value)} required />
            </label>
            <div className="payment-method">
              <h4>Fizetési mód</h4>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Kártyás fizetés
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Utánvétel
              </label>
            </div>
            <button className="primary-button" type="submit" disabled={isSubmitting || items.length === 0}>
              Rendelés leadása
            </button>
          </form>
          {message && <p className="status-text">{message}</p>}
        </div>

        <aside className="order-summary">
          <h3>Rendelés áttekintés</h3>
          {items.length === 0 ? (
            <p>A kosarad üres.</p>
          ) : (
            <div className="summary-list">
              {items.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x{item.quantity}</span>
                  <strong>{(item.price * item.quantity).toLocaleString()} Ft</strong>
                </div>
              ))}
            </div>
          )}
          <div className="summary-total">
            <span>Fizetési mód:</span>
            <strong>{paymentMethod === 'card' ? 'Bankkártya' : 'Utánvétel'}</strong>
          </div>
          <div className="summary-total">
            <span>Összesen:</span>
            <strong>{total.toLocaleString()} Ft</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default CheckoutPage;
