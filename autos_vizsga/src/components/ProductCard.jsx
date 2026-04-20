import { useCart } from '../lib/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const compatibilityText = (() => {
    if (
      product.compatibility &&
      typeof product.compatibility.join === 'function'
    ) {
      return product.compatibility.join(', ');
    }

    if (typeof product.compatibility === 'string') {
      try {
        const parsed = JSON.parse(product.compatibility);
        if (Array.isArray(parsed)) {
          return parsed.join(', ');
        }
      } catch {
        // nem JSON formátumú string
      }
      return product.compatibility;
    }

    return 'Nincs adat';
  })();

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-details">
        <div className="product-labels">
          <span className="badge">{product.brand}</span>
          <span className="badge muted">{product.category}</span>
        </div>
        <h3>{product.name}</h3>
        <p className="muted">OEM: {product.oem}</p>
        <p>{product.description}</p>
        <div className="compatibility">
          <strong>Kompatibilitás:</strong>
          <span>{compatibilityText}</span>
        </div>
      </div>
      <div className="product-footer">
        <div>
          <p className="price">{product.price.toLocaleString()} Ft</p>
          <p className="stock">Raktár: {product.inventory}</p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCart(product)}
        >
          Kosárba
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
