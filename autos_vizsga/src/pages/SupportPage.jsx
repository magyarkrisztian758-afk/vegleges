function SupportPage() {
  return (
    <main className="container page-panel">
      <section className="form-card">
        <h2>Ügyfélszolgálat</h2>
        <p>Segítünk a rendeléseddel, szállítással és garanciával kapcsolatban.</p>
        <div className="support-grid">
          <div>
            <h3>Kapcsolat</h3>
            <p>Email: support@carcore.hu</p>
            <p>Telefon: +36 30 123 4567</p>
          </div>
          <div>
            <h3>Nyitvatartás</h3>
            <p>Hétfő–Péntek: 9:00–18:00</p>
            <p>Szombat: 9:00–13:00</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SupportPage;
