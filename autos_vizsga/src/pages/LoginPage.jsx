import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('Bejelentkezés folyamatban...');

    try {
      await login(email, password);
      setMessage('Sikeres bejelentkezés! Átirányítás...');
      setEmail('');
      setPassword('');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Bejelentkezési hiba:', error);
      setMessage(error.message || 'Hiba történt a bejelentkezés során.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container auth-page">
      <section className="auth-panel">
        <h2>Bejelentkezés</h2>
        <p>Jelentkezz be CarCore fiókoddal, hogy folytasd a vásárlást.</p>
        <form onSubmit={submit} className="form-card">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Jelszó
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>
        {message && <p className="status-text">{message}</p>}
      </section>
    </main>
  );
}

export default LoginPage;
