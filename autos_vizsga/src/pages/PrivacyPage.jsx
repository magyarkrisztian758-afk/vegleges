function PrivacyPage() {
  return (
    <main className="container page-panel">
      <section className="form-card">
        <h2>Adatvédelem</h2>
        <p>
          A CarCore az ügyfelek adatait bizalmasan kezeli, és csak a rendelés teljesítéséhez használja fel.
        </p>
        <ul>
          <li>A jelszavakat fejlesztési környezetben nem tároljuk titkosítatlanul.</li>
          <li>Csak szükséges adatokat kérünk be a rendeléshez.</li>
          <li>Harmadik félnek személyes adatokat nem adunk át engedély nélkül.</li>
        </ul>
      </section>
    </main>
  );
}

export default PrivacyPage;
