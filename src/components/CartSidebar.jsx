import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { CartItem } from './CartItem';
import { RemoveConfirmModal, CheckoutModal } from './Dialog';
import { X, ShoppingCart, ShoppingBag, CreditCard } from 'lucide-react';

/**
 * Slide-out shopping cart sidebar drawer with confirmation modal triggers.
 */
export function CartSidebar() {
  const isCartOpen = useStore((state) => state.isCartOpen);
  const cart = useStore((state) => state.cart);
  const toggleCart = useStore((state) => state.toggleCart);
  const removeFromCart = useStore((state) => state.removeFromCart);

  // States to control pop-up dialog overlays (Feature 1)
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Clean-up handler: clicking outside the sidebar closes it
  if (!isCartOpen) return null;

  // Feature 3: Sum of quantities of all items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.product.id);
      setItemToRemove(null);
    }
  };

  return (
    <>
      {/* Backdrop overlay (Feature 16: clicking backdrop closes sidebar drawer) */}
      <div className="cart-sidebar-backdrop" onClick={toggleCart}></div>

      {/* Cart drawer (Feature 1) */}
      <div className="cart-sidebar">
        <div className="cart-sidebar-header">
          <h2>
            <ShoppingCart size={22} />
            購物車 ({totalItems})
          </h2>
          <button
            className="close-sidebar-btn"
            onClick={toggleCart}
            aria-label="關閉購物車"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon-wrapper">
                <ShoppingBag size={32} />
              </div>
              <p>您的購物車是空的</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onTriggerRemove={setItemToRemove}
              />
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-summary-row">
              <span className="cart-summary-label">小計</span>
              <span className="cart-summary-val">NT$ {totalPrice.toLocaleString()}</span>
            </div>
            <div className="cart-summary-row">
              <span className="cart-summary-label">運費</span>
              <span className="cart-summary-val" style={{ color: 'var(--success)', fontWeight: '700' }}>
                免運費
              </span>
            </div>
            <div className="cart-total-row">
              <span>總計</span>
              <span className="cart-total-price">NT$ {totalPrice.toLocaleString()}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={() => setIsCheckoutOpen(true)}
              type="button"
              aria-label="前往結帳"
            >
              <CreditCard size={18} />
              <span>立即結帳</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog overlays (Feature 1) */}
      <RemoveConfirmModal
        isOpen={itemToRemove !== null}
        onClose={() => setItemToRemove(null)}
        itemName={itemToRemove?.product.name || ''}
        onConfirm={handleConfirmRemove}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
