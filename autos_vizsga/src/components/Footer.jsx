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
            <li><a href="/">Főoldal</a></li>
            <li><a href="/garancia">Garancia</a></li>
            <li><a href="/szallitas">Szállítás</a></li>
            <li><a href="/visszakuldes">Visszaküldés</a></li>
          </ul>
        </div>
        <div>
          <h4>Kapcsolat</h4>
          <p>Email: support@carcore.hu</p>
          <p>Telefon: +36 30 123 4567</p>
          <p>Cím: Budapest, Magyarország</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
