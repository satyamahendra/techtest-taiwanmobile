import React, { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, User, Phone, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';

/**
 * Reusable base Dialog overlay component.
 */
export function Dialog({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="dialog-header">
          <h3>{title}</h3>
          <button
            className="dialog-close-btn"
            onClick={onClose}
            aria-label="關閉對話框"
          >
            <X size={18} />
          </button>
        </div>
        <div className="dialog-body">{children}</div>
      </div>
    </div>
  );
}

/**
 * Specialized Dialog for Remove Item Confirmation.
 */
export function RemoveConfirmModal({ isOpen, onClose, itemName, onConfirm }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="確認移除商品">
      <div style={{ paddingBottom: '16px', fontSize: '15px' }}>
        您確定要將 <strong style={{ color: 'var(--primary)' }}>{itemName}</strong> 從購物車中移除嗎？
      </div>
      <div className="dialog-footer" style={{ borderTop: 'none', padding: '16px 0 0 0' }}>
        <button className="btn-secondary" onClick={onClose}>
          取消
        </button>
        <button className="btn-danger" onClick={onConfirm}>
          確認移除
        </button>
      </div>
    </Dialog>
  );
}

/**
 * Specialized Dialog for Checkout Form & Process.
 */
export function CheckoutModal({ isOpen, onClose }) {
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const toggleCart = useStore((state) => state.toggleCart);
  
  const [step, setStep] = useState('form'); // 'form' | 'loading' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'credit'
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      setStep('form');
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) return;
    
    setStep('loading');
    
    // Simulate simulated network delay for transaction approval
    setTimeout(() => {
      setStep('success');
    }, 1800);
  };

  const handleSuccessClose = () => {
    clearCart();
    onClose();
    toggleCart(); // Close the cart sidebar drawer too
  };

  if (step === 'form') {
    return (
      <Dialog isOpen={isOpen} onClose={onClose} title="填寫結帳資料">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="checkout-name">
              <User size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
              收件人姓名
            </label>
            <input
              type="text"
              id="checkout-name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="例如: 王小明"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="checkout-phone">
              <Phone size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
              聯絡電話
            </label>
            <input
              type="tel"
              id="checkout-phone"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="例如: 0912345678"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="checkout-address">
              <MapPin size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
              配送地址
            </label>
            <input
              type="text"
              id="checkout-address"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="例如: 台北市信義區信義路五段7號"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="checkout-payment">
              <CreditCard size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
              付款方式
            </label>
            <select
              id="checkout-payment"
              name="payment"
              className="form-input"
              value={formData.payment}
              onChange={handleInputChange}
            >
              <option value="credit">信用卡 / 金融卡線上刷卡</option>
              <option value="cod">貨到付款</option>
              <option value="transfer">ATM 銀行轉帳</option>
            </select>
          </div>

          <div style={{ marginTop: '20px', padding: '12px 16px', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>商品數量:</span>
              <strong>{totalItems} 件</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
              <span>應付總額:</span>
              <strong style={{ color: 'var(--primary)' }}>NT$ {totalPrice}</strong>
            </div>
          </div>

          <div className="dialog-footer" style={{ borderTop: 'none', padding: '20px 0 0 0' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              確認訂單
            </button>
          </div>
        </form>
      </Dialog>
    );
  }

  if (step === 'loading') {
    return (
      <Dialog isOpen={isOpen} onClose={() => {}} title="處理交易中...">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
            正在安全驗證與提交訂單，請勿關閉視窗...
          </p>
        </div>
      </Dialog>
    );
  }

  if (step === 'success') {
    return (
      <Dialog isOpen={isOpen} onClose={handleSuccessClose} title="訂單已完成">
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div className="success-icon-wrapper">
            <CheckCircle size={36} />
          </div>
          <h4 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--secondary)', marginBottom: '8px' }}>
            感謝您的購買！
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
            訂單已成功送出！我們將儘速處理出貨事宜。<br />
            收件人: {formData.name} <br />
            寄送至: {formData.address}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)', textAlign: 'left', fontSize: '13px', color: 'var(--text-muted)' }}>
            <div>訂單編號: TW-{Date.now().toString().slice(-8)}</div>
            <div>付款方式: {formData.payment === 'credit' ? '線上刷卡' : formData.payment === 'cod' ? '貨到付款' : 'ATM 轉帳'}</div>
            <div>實付金額: <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '15px' }}>NT$ {totalPrice}</span></div>
          </div>
        </div>
        <div className="dialog-footer" style={{ borderTop: 'none', padding: '20px 0 0 0' }}>
          <button className="btn-primary" style={{ width: '100%' }} onClick={handleSuccessClose}>
            完成並關閉
          </button>
        </div>
      </Dialog>
    );
  }

  return null;
}
