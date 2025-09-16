'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './ui/LoadingSpinner';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onProductClick: (product: Product) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function ProductGrid({ products, loading, onProductClick }: ProductGridProps) {
  if (loading) {
    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div key={index} variants={itemVariants}>
            <ProductCardSkeleton />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        layout
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            layout
            layoutId={`product-${product.id}`}
          >
            <ProductCard
              product={product}
              onClick={() => onProductClick(product)}
              index={index}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
