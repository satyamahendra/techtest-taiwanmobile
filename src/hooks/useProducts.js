import { useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useDebounce } from './useDebounce';

/**
 * Custom hook to manage fetching and filtering of products based on the search query.
 */
export function useProducts() {
  const { products, isLoadingProducts, productsError, fetchProducts, searchQuery } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce the search query to optimize filtering operations
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Memoize filtered results to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return products;
    }
    const query = debouncedSearch.toLowerCase().trim();
    return products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }, [products, debouncedSearch]);

  return {
    products: filteredProducts,
    isLoading: isLoadingProducts,
    error: productsError,
    totalProductsCount: products.length
  };
}
