import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/useAuth';
import { supabase } from '../lib/supabaseClient';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutFormContent() {
  const stripe = useStripe();
  const elements = useElements();
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

  const createOrder = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_price: total,
            shipping_address: `${city}, ${address}`,
            status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
          },
        ])
        .select();

      if (orderError) {
        console.error('❌ Order insert hiba:', orderError);
        throw new Error(orderError.message);
      }

      const orderId = orderData[0].id;
      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('❌ Order items insert hiba:', itemsError);
        throw new Error(itemsError.message);
      }

      for (const item of items) {
        const { error: rpcError } = await supabase.rpc('decrement_stock', {
          product_id: item.id,
          quantity: item.quantity,
        });

        if (rpcError) {
          console.error('❌ Stock decrement RPC hiba:', rpcError);
          throw new Error(rpcError.message);
        }
      }

      return orderId;
    } catch (error) {
      throw error;
    }
  };

  const handleCardPayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setMessage('❌ Stripe még nem töltött be. Kérlek, próbáld később!');
      return;
    }

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
      // 1. Rendelés létrehozása az adatbázisban
      const orderId = await createOrder();


      // 2. PaymentIntent létrehozása a backend-en
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: total }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment intent hiba');
      }

      const paymentIntentSecret = data.clientSecret;

      // 3. Stripe fizetés feldolgozása
      const result = await stripe.confirmCardPayment(paymentIntentSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: name,
            address: {
              line1: address,
              city: city,
              postal_code: postal,
            },
          },
        },
      });

      if (result.error) {
        console.error('❌ Stripe error:', result.error);
        setMessage(`❌ Fizetési hiba: ${result.error.message}`);
        setIsSubmitting(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {

        // 4. Rendelés státusza frissítése
        await supabase
          .from('orders')
          .update({ status: 'confirmed' })
          .eq('id', orderId);

        setMessage('✓ Fizetés sikeres! Rendelés megerősítve!');
        clearCart();
        setTimeout(() => {
          navigate('/order-preview', { state: { orderId } });
        }, 1500);
      } else {
        setMessage('❌ Fizetés feldolgozása sikertelen volt. Kérlek, próbáld újra!');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('❌ Nem várt hiba:', error);
      setMessage(`❌ Hiba történt: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const handleCODPayment = async (event) => {
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
      const orderId = await createOrder();
      setMessage('✓ Rendelés sikeresen leadva! Az összeg az átvételkor esedékes!');
      clearCart();
      setTimeout(() => {
        navigate('/order-preview', { state: { orderId } });
      }, 1500);
    } catch (error) {
      console.error('❌ Nem várt hiba:', error);
      setMessage(`❌ Hiba történt: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const submit = (event) => {
    if (paymentMethod === 'card') {
      handleCardPayment(event);
    } else {
      handleCODPayment(event);
    }
  };

  return (
    <main className="container checkout-page">
      <section className="checkout-grid">
        <div className="form-card">
          <h2>Szállítási adatok és fizetés</h2>
          <form onSubmit={submit}>
            <label>
              Név
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </label>
            <label>
              Cím
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </label>
            <label>
              Város
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </label>
            <label>
              Irányítószám
              <input
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
                required
                disabled={isSubmitting}
              />
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
                  disabled={isSubmitting}
                />
                Bankkártya (Stripe)
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={isSubmitting}
                />
                Utánvétel
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-element-container">
                <label>Bankkártya adatok</label>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#fa755a',
                      },
                    },
                  }}
                  disabled={isSubmitting}
                />
              </div>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting ? 'Feldolgozás...' : 'Rendelés leadása'}
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

function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent />
    </Elements>
  );
}

export default CheckoutPage;
