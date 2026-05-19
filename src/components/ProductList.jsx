import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { AlertCircle, SearchX, RotateCw } from 'lucide-react';
import { useStore } from '../store/useStore';

export function ProductList() {
  const { products, isLoading, error } = useProducts();
  const fetchProducts = useStore((state) => state.fetchProducts);
  const searchQuery = useStore((state) => state.searchQuery);

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>商品載入中，請稍後...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <AlertCircle size={48} className="error-icon" />
        <p>{error}</p>
        <button
          onClick={fetchProducts}
          className="btn-primary retry-btn"
          type="button"
        >
          <RotateCw size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
          重新嘗試
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-search-state">
        <SearchX size={48} />
        <p>找不到符合「{searchQuery}」的商品，請嘗試其他關鍵字。</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
