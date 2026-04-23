import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { supabase } from '../lib/supabaseClient';

function OrderHistory() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      setError('Kérlek, jelentkezz be a rendeléseid megtekintéséhez.');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Rendelések lekérési hiba:', fetchError);
          setError(`Hiba a rendelések lekérésekor: ${fetchError.message}`);
          return;
        }

        setOrders(data || []);
      } catch (err) {
        console.error('Nem várt hiba:', err);
        setError('Nem várt hiba történt.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="container page-panel">
        <section className="form-card">
          <h2>Rendeléseim</h2>
          <p>Betöltés...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container page-panel">
        <section className="form-card">
          <h2>Rendeléseim</h2>
          <p className="status-text" style={{ color: '#ff5a67' }}>❌ {error}</p>
          {!user && (
            <button
              className="primary-button"
              onClick={() => navigate('/login')}
              style={{ marginTop: '16px' }}
            >
              Bejelentkezés
            </button>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="container page-panel">
      <section className="form-card">
        <h2>Rendeléseim</h2>
        <p>Korábbi megrendeléseid listája.</p>
        {orders.length === 0 ? (
          <p style={{ marginTop: '16px', color: '#9aa3ad' }}>Még nincsenek rendeléseid.</p>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Rendelés ID</th>
                  <th>Dátum</th>
                  <th>Összeg</th>
                  <th>Állapot</th>
                  <th>Cím</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id.slice(0, 8)}...</td>
                    <td>{new Date(order.created_at).toLocaleDateString('hu-HU')}</td>
                    <td>{order.total_price.toLocaleString('hu-HU')} Ft</td>
                    <td>
                      {order.status === 'pending' ? '⏳ Függőben' :
                       order.status === 'completed' ? '✓ Befejezve' :
                       order.status === 'cancelled' ? '✗ Visszavonva' :
                       order.status}
                    </td>
                    <td>{order.shipping_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default OrderHistory;
