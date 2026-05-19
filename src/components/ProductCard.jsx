import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

export function ProductCard({ product }) {
  const addToCart = useStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setQuantity(val);
    } else {
      setQuantity('');
    }
  };

  const handleInputBlur = () => {
    if (quantity === '' || quantity <= 0) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    const qty = parseInt(quantity, 10) || 1;
    addToCart(product, qty);
    setQuantity(1); // Reset the card selector quantity back to 1
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            // Fallback SVG representation if the unsplash image fails to load
            e.target.style.display = 'none';
            const parent = e.target.parentNode;
            parent.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="55" x="50" font-size="14" text-anchor="middle" fill="%2394a3b8">圖片已損毀</text></svg>')`;
            parent.style.backgroundRepeat = 'no-repeat';
            parent.style.backgroundPosition = 'center';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <div className="product-price">NT$ {product.price.toLocaleString()}</div>
        <div className="product-action-row">
          {/* Feature 5: Add by multiples using local stepper */}
          <div className="product-qty-select">
            <button
              onClick={handleDecrement}
              className="product-qty-btn"
              type="button"
              aria-label="減少數量"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="product-qty-input"
              aria-label="設定商品數量"
            />
            <button
              onClick={handleIncrement}
              className="product-qty-btn"
              type="button"
              aria-label="增加數量"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="add-btn"
            type="button"
            aria-label="將商品加入購物車"
          >
            <ShoppingCart size={16} />
            <span>加入購物車</span>
          </button>
        </div>
      </div>
    </div>
  );
}
