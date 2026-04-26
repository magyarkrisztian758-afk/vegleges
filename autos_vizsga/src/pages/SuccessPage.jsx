import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function SuccessPage() {
  console.log('SuccessPage rendered');

  useEffect(() => {
    console.log('SuccessPage useEffect');
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      console.log('Session ID:', sessionId);
      // Lekérjük a session adatokat a backend-től
      fetch(`/api/checkout-session/${sessionId}`)
        .then(response => response.json())
        .then(session => {
          console.log('Session data:', session);
          console.log('Line items:', session.line_items?.data);
          // Csökkentjük a stock-ot minden termékhez
          const promises = session.line_items?.data?.map(item => {
            const productId = item.price.metadata?.product_id;
            const quantity = item.quantity;
            console.log('Decrementing stock for product', productId, 'quantity', quantity);
            return supabase.rpc('decrement_stock', { product_id: parseInt(productId), quantity });
          }) || [];
          return Promise.all(promises);
        })
        .then(() => {
          console.log('Stock updated successfully');
        })
        .catch(error => {
          console.error('Error updating stock:', error);
        });
    } else {
      console.log('No session_id in URL');
    }
  }, []);

  return (
    <main className="container">
      <section className="hero-section">
        <div>
          <h2>Sikeres fizetés!</h2>
          <p>Köszönjük a vásárlást. A rendelésed feldolgozása megkezdődött.</p>
        </div>
      </section>
    </main>
  );
}

export default SuccessPage;