import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabaseClient';

function HomePage({ filters }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*');
        
        if (fetchError) throw fetchError;
        setProducts(data || []);
      } catch (err) {
        console.error('Hiba a termékek betöltésekor:', err);
        setError('Nem sikerült betölteni a termékeket. Próbáld újra később.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Szűrők változásakor visszaállítjuk az oldalt 1-re
  }, [filters]);

  const filtered = products.filter((item) => {
    const matchesQuery = filters.query
      ? item.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.query.toLowerCase())
      : true;
    const matchesBrand = filters.brand
      ? item.brand.toLowerCase().includes(filters.brand.toLowerCase())
      : true;
    const matchesOem = filters.oem
      ? item.oem.toLowerCase().includes(filters.oem.toLowerCase())
      : true;
    return matchesQuery && matchesBrand && matchesOem;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = filtered.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container">
      <section className="hero-section">
        <div>
          <p className="eyebrow">Autóalkatrész webshop</p>
          <h2>Találd meg a legjobb alkatrészt a CarCore kínálatából.</h2>
          <p className="hero-text">
            Gyors szűrés márka, név és OEM szerint. Kosár és pénztár funkció kész.
          </p>
        </div>
      </section>

      <section className="product-grid">
        {loading ? (
          <div className="empty-state">
            <h3>Betöltés...</h3>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h3>Hiba</h3>
            <p>{error}</p>
          </div>
        ) : displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="empty-state">
            <h3>Nincs találat.</h3>
            <p>Próbálj meg más keresést vagy márkát.</p>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <section className="pagination">
          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Előző
          </button>
          <span className="pagination-info">
            {currentPage} / {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Következő
          </button>
        </section>
      )}
    </main>
  );
}

export default HomePage;
