import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/useAuth';
import { supabase } from '../lib/supabaseClient';

function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
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
    
    if (!user) {
      setMessage('❌ Kérlek, jelentkezz be a rendelés leadásához!');
      return;
    }

    if (items.length === 0) {
      setMessage('❌ A kosarad üres!');
      return;
    }

    setIsSubmitting(true);
    setMessage('⏳ Rendelés feldolgozása...');

    try {
      // Insert order into orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_price: total,
            shipping_address: `${city}, ${address}`,
            status: 'pending',
          },
        ])
        .select();

      if (orderError) {
        console.error('❌ Order insert hiba:', orderError);
        setMessage(`❌ Hiba a rendelés létrehozásakor: ${orderError.message}`);
        setIsSubmitting(false);
        return;
      }

      if (!orderData || orderData.length === 0) {
        setMessage('❌ Hiba: nincs visszaadott rendelés adat');
        setIsSubmitting(false);
        return;
      }

      const orderId = orderData[0].id;
      console.log('✓ Rendelés létrehozva:', orderId);

      // Prepare order items
      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      // Insert order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('❌ Order items insert hiba:', itemsError);
        setMessage(`❌ Hiba a rendelés tételek mentésekor: ${itemsError.message}`);
        setIsSubmitting(false);
        return;
      }

      console.log('✓ Rendelés tételei mentve');

      // Update product stock using RPC
      for (const item of items) {
        console.log(`Attempting to decrement stock for product ${item.id} by ${item.quantity}`);
        const { data, error: rpcError } = await supabase.rpc('decrement_stock', {
          product_id: item.id,
          quantity: item.quantity,
        });

        if (rpcError) {
          console.error('❌ Stock decrement RPC hiba:', rpcError);
          setMessage(`❌ Hiba a készlet frissítésekor: ${rpcError.message}`);
          setIsSubmitting(false);
          return;
        }

        console.log(`✓ ${item.name} készlet frissítve: ${data}`);
      }

      console.log('✓ Készletek frissítve');
      setMessage('✓ Rendelés sikeresen leadva!');
      clearCart();
      setTimeout(() => {
        navigate('/order-preview', { state: { orderId } });
      }, 1000);
    } catch (error) {
      console.error('❌ Nem várt hiba:', error);
      setMessage(`❌ Hiba történt: ${error.message}`);
      setIsSubmitting(false);
    }
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
