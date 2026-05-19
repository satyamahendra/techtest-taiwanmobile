import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

/**
 * Individual row displaying cart item, price, and editable quantity controls.
 */
export function CartItem({ item, onTriggerRemove }) {
  const updateQuantity = useStore((state) => state.updateQuantity);

  const handleIncrement = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      // Trigger confirmation dialog instead of removing immediately when quantity falls to 0
      onTriggerRemove(item);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      updateQuantity(item.product.id, '');
      return;
    }
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      updateQuantity(item.product.id, parsed);
    }
  };

  const handleInputBlur = () => {
    if (item.quantity === '' || item.quantity <= 0) {
      // On blur, if invalid/empty quantity is submitted, trigger removal dialogue
      onTriggerRemove(item);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-img-wrapper">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="cart-item-img"
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentNode;
            parent.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="55" x="50" font-size="10" text-anchor="middle" fill="%2394a3b8">圖片</text></svg>')`;
            parent.style.backgroundRepeat = 'no-repeat';
            parent.style.backgroundPosition = 'center';
          }}
        />
      </div>
      <div className="cart-item-content">
        <h4 className="cart-item-title">{item.product.name}</h4>
        <div className="cart-item-price">NT$ {item.product.price.toLocaleString()}</div>
        <div className="cart-item-actions">
          {/* Feature 5: Custom multiples quantity adjustment using number input + steppers */}
          <div className="cart-item-qty-input-wrapper">
            <button
              onClick={handleDecrement}
              className="cart-item-qty-btn"
              type="button"
              aria-label="減少數量"
            >
              <Minus size={12} />
            </button>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="cart-item-qty-input"
              aria-label="修改數量"
            />
            <button
              onClick={handleIncrement}
              className="cart-item-qty-btn"
              type="button"
              aria-label="增加數量"
            >
              <Plus size={12} />
            </button>
          </div>

          <button
            onClick={() => onTriggerRemove(item)}
            className="cart-item-remove-btn"
            type="button"
            aria-label="從購物車移除"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
