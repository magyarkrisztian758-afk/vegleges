import { users } from '../lib/userData';
import { orders } from '../lib/orderData';

function AdminPanel() {
  return (
    <main className="container page-panel">
      <section className="form-card admin-panel">
        <h2>Admin panel</h2>
        <p>Egyszerű áttekintés a felhasználókról és rendelésekről.</p>

        <div className="table-card">
          <h3>Felhasználók</h3>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Születési dátum</th>
                <th>Szerepkör</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>{user.birthDate}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <h3>Rendelések</h3>
          <table>
            <thead>
              <tr>
                <th>Rendelés</th>
                <th>Email</th>
                <th>Összeg</th>
                <th>Fizetés</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.email}</td>
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

export default AdminPanel;
