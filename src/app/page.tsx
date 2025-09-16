
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import ProductDetailModal from '@/components/ProductDetailModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { productApi } from '@/services/api';
import type { Product, Category, FilterState, PaginationState } from '@/types/product';

const PRODUCTS_PER_PAGE = 12;

export default function Home() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [filterState, setFilterState] = useState<FilterState>({
    category: '',
    sortBy: 'title-asc',
    searchQuery: '',
  });
  
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    limit: PRODUCTS_PER_PAGE,
    total: 0,
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    
    fetchCategories();
  }, []);

  // Sort products client-side
  const sortProducts = useCallback((products: Product[], sortBy: string) => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, []);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply search filter
    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    return sortProducts(filtered, filterState.sortBy);
  }, [products, filterState.searchQuery, filterState.sortBy, sortProducts]);

  // Update pagination when processed products change
  useEffect(() => {
    const total = processedProducts.length;
    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
    
    setPagination(prev => ({
      ...prev,
      total,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages || 1),
    }));
  }, [processedProducts.length]);

  // Get current page products
  const currentPageProducts = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return processedProducts.slice(startIndex, endIndex);
  }, [processedProducts, pagination.currentPage]);

  // Fetch products
  const fetchProducts = useCallback(async (category = '') => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      
      if (category) {
        data = await productApi.getProductsByCategory(category, 100, 0); // Fetch more for client-side filtering
      } else {
        data = await productApi.getProducts(100, 0); // Fetch more for client-side filtering
      }
      
      setProducts(data.products);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilterState(prev => {
      const updated = { ...prev, ...newFilters };
      
      // Reset page when filters change
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      
      // If category changed, fetch new products
      if (newFilters.category !== undefined && newFilters.category !== prev.category) {
        fetchProducts(updated.category);
      }
      
      return updated;
    });
  }, [fetchProducts]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle product selection
  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.header
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <div className="relative">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Productify
                </h1>
                <p className="text-sm text-gray-600">Product Showcase Explorer</p>
              </div>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <span>Discover • Explore • Shop</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Products
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of products with powerful filtering, sorting, and search capabilities.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          filterState={filterState}
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* Products Grid */}
        <ProductGrid
          products={currentPageProducts}
          loading={loading}
          onProductClick={handleProductClick}
        />

        {/* Pagination */}
        {!loading && currentPageProducts.length > 0 && (
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LoadingSpinner size="lg" />
          </motion.div>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-white mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">Productify</span>
            </div>
            <p className="text-gray-400">
              Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion
            </p>
            <p className="text-gray-500 text-sm mt-2">
              © 2025 Productify. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
