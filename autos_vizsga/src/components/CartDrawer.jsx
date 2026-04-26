import { useNavigate } from 'react-router-dom';
import { X, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../lib/CartContext';

function CartDrawer() {
  const {
    items,
    total,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-drawer">
        <div className="cart-header">
          <div>
            <h3>Kosár tartalma</h3>
            <p>{items.length} termék</p>
          </div>
          <button className="icon-button" type="button" onClick={() => setIsCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-state">
              <p>A kosarad üres.</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <h4>{item.name}</h4>
                  <p className="muted">OEM: {item.oem}</p>
                  <div className="cart-qty">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <span>{item.price} Ft</span>
                  <button type="button" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Összesen:</span>
            <strong>{total.toLocaleString()} Ft</strong>
          </div>
          <div className="cart-actions">
            <button className="secondary-button" type="button" onClick={clearCart}>
              Kosár ürítése
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
            >
              Pénztárhoz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
