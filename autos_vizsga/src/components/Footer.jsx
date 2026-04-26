import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h4>CarCore</h4>
          <p>
            Autóalkatrész webáruház egyszerűen. Alkatrészek széles választéka, gyors
            keresés és letisztult felület.
          </p>
        </div>
        <div>
          <h4>Szolgáltatások</h4>
          <ul>
            <li><Link to="/">Főoldal</Link></li>
            <li><Link to="/garancia">Garancia</Link></li>
            <li><Link to="/szallitas">Szállítás</Link></li>
            <li><Link to="/visszakuldes">Visszaküldés</Link></li>
          </ul>
        </div>
        <div>
          <h4>Kapcsolat</h4>
          <p>Telefon: +36 20 224 1115</p>
          <p>Cím: Szolnok, Áchim András u. 12-14, 5000</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
