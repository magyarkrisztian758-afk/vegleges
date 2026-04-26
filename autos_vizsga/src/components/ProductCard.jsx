import { useCart } from '../lib/CartContext';
import { useState } from 'react';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

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
      <img 
        src={!imageError && product.image_url ? product.image_url : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3EKép nem elérhető%3C/text%3E%3C/svg%3E'}
        alt={product.name}
        onError={() => setImageError(true)}
      />
      <div className="product-details">
        <div className="product-labels">
          <span className="badge">{product.brand}</span>
          <span className="badge muted">{product.category}</span>
        </div>
        <h3>{product.name}</h3>
        <p className="muted">OEM: {product.oem_code}</p>
        <p>{product.description}</p>
        <div className="compatibility">
          <strong>Kompatibilitás:</strong>
          <span>{compatibilityText}</span>
        </div>
      </div>
      <div className="product-footer">
        <div>
          <p className="price">{product.price.toLocaleString()} Ft</p>
          <p className="stock">
            Raktár: {product.stock > 0 ? `${product.stock} db` : 'Nincs raktáron'}
          </p>
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
