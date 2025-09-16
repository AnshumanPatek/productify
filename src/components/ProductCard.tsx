'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index: number;
}

export default function ProductCard({ product, onClick, index }: ProductCardProps) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card hover onClick={onClick} className="h-full">
        <div className="relative overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="relative h-48 w-full"
          >
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
          
          {product.discountPercentage > 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.2 }}
              className="absolute top-2 left-2"
            >
              <Badge variant="error" size="sm">
                -{Math.round(product.discountPercentage)}%
              </Badge>
            </motion.div>
          )}
          
          <motion.div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full p-2 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart functionality
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <Badge variant="info" size="sm" className="mb-2">
              {product.category}
            </Badge>
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm text-gray-600">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <Badge 
              variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
              size="sm"
            >
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
