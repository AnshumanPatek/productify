'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, Share2, Truck, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import type { Product } from '@/types/product';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              layoutId={`product-${product.id}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Badge variant="info">{product.category}</Badge>
                  <Badge variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}>
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                <Button variant="ghost" onClick={onClose} className="p-2 rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid md:grid-cols-2 gap-8 p-6">
                  {/* Image Gallery */}
                  <div className="space-y-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                      <Image
                        src={images[currentImageIndex]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="error">
                            -{Math.round(product.discountPercentage)}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* Thumbnail Gallery */}
                    {images.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                              index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${product.title} ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
                          <span className="ml-1 text-gray-500">
                            ({product.reviews?.length || 0} reviews)
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">Brand: {product.brand}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl font-bold text-gray-900">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="text-lg text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {product.discountPercentage > 0 && (
                        <p className="text-green-600 font-medium">
                          You save ${(product.price - discountedPrice).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </Button>
                      
                      <div className="flex space-x-3">
                        <Button variant="outline" className="flex-1">
                          <Heart className="h-4 w-4 mr-2" />
                          Wishlist
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Truck className="h-4 w-4" />
                        <span>Free shipping</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>2 year warranty</span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">SKU:</span>
                          <span className="ml-2 font-medium">{product.sku}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Weight:</span>
                          <span className="ml-2 font-medium">{product.weight}kg</span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-gray-500">Return Policy:</span>
                        <span className="ml-2">{product.returnPolicy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
