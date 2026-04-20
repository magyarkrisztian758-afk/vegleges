import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('Regisztráció folyamatban...');

    try {
      await register(email, password, fullName, address, phone);
      setMessage('Sikeres regisztráció! Kérlek ellenőrizd az emailedet, majd jelentkezz be.');
      setEmail('');
      setPassword('');
      setFullName('');
      setAddress('');
      setPhone('');
      navigate('/login');
    } catch (error) {
      console.error('Regisztrációs hiba:', error);
      setMessage(error.message || 'Hiba történt a regisztráció során.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container auth-page">
      <section className="auth-panel">
        <h2>Regisztráció</h2>
        <p>Hozz létre új CarCore fiókot email címmel és jelszóval.</p>
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
              minLength={6}
            />
          </label>

          <label>
            Teljes név
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label>
            Lakcím
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>

          <label>
            Telefonszám
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="[0-9+\-() ]{7,}"
              placeholder="Pl. +36 30 123 4567"
              required
            />
          </label>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Regisztráció...' : 'Regisztráció'}
          </button>
        </form>
        {message && <p className="status-text">{message}</p>}
      </section>
    </main>
  );
}

export default RegisterPage;
