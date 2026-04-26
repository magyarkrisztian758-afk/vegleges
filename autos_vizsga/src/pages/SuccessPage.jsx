import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function SuccessPage() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetch(`/api/checkout-session/${sessionId}`)
        .then(response => response.json())
        .then(session => {
          const promises = session.line_items?.data?.map(item => {
            const productId = item.price.metadata?.product_id;
            const quantity = item.quantity;
            return supabase.rpc('decrement_stock', { product_id: parseInt(productId), quantity });
          }) || [];
          return Promise.all(promises);
        })
        .catch(error => {
          console.error('Error updating stock:', error);
        });
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