import React from 'react';
import { useStore } from '../store/useStore';
import { ShoppingCart, Search, X, ShoppingBag } from 'lucide-react';

export function Header() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const cart = useStore((state) => state.cart);
  const toggleCart = useStore((state) => state.toggleCart);

  // Feature 3: Count total quantity of all items in the shopping cart
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="logo-section">
          <h1>
            <ShoppingBag className="logo-accent" size={28} strokeWidth={2.5} />
            精品商店 <span className="logo-accent">Store</span>
          </h1>
        </div>

        {/* Feature 4: Search input box */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="搜尋商品..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="搜尋商品"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={handleClearSearch}
                aria-label="清除搜尋"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <button
          className="cart-toggle-btn"
          onClick={toggleCart}
          aria-label="開啟購物車"
          type="button"
        >
          <ShoppingCart size={18} />
          <span>購物車</span>
          {totalQuantity > 0 && (
            <span className="cart-badge" id="cartCount">
              {totalQuantity}
            </span>
          )}
        </button>
      </header>
    </div>
  );
}
