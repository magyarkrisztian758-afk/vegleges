import { orders } from '../lib/orderData';

function OrderHistory() {
  return (
    <main className="container page-panel">
      <section className="form-card">
        <h2>Rendeléseim</h2>
        <p>Korábbi megrendeléseid listája.</p>
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Rendelés</th>
                <th>Dátum</th>
                <th>Összeg</th>
                <th>Fizetés</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.timestamp).toLocaleDateString()}</td>
                  <td>{order.total.toLocaleString()} Ft</td>
                  <td>{order.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default OrderHistory;
