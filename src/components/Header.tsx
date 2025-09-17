'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Menu, Search, User, Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
}

export default function Header({ onSearchChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              <motion.div
                className="w-10 h-10 lg:w-12 lg:h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </motion.div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">
                Productify
              </h1>
              <p className="text-xs lg:text-sm text-gray-600 font-medium">
                Product Explorer
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {['Home', 'Products', 'Categories', 'About'].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 font-medium transition-all duration-300 relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </nav>

          {/* Search Bar (Desktop) */}
          <motion.div
            className="hidden md:flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 w-64 lg:w-80 shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Search className="h-4 w-4 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search amazing products..."
              className="bg-transparent flex-1 text-sm focus:outline-none text-gray-900 placeholder-gray-400"
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </motion.div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Mobile Search */}
            <motion.button
              className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="h-5 w-5 text-gray-600" />
            </motion.button>

            {/* Wishlist */}
            <motion.button
              className="hidden sm:flex p-2 lg:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </motion.button>

            {/* Cart */}
            <motion.button
              className="p-2 lg:p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg relative"
              whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                5
              </span>
            </motion.button>

            {/* User Profile */}
            <motion.button
              className="hidden sm:flex p-2 lg:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <User className="h-5 w-5 text-gray-600" />
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="lg:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`lg:hidden overflow-hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}
          initial={false}
          animate={{ maxHeight: isMenuOpen ? 384 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 space-y-4">
            {/* Mobile Search */}
            <div className="md:hidden">
              <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent flex-1 text-sm focus:outline-none text-gray-900 placeholder-gray-400"
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {['Home', 'Products', 'Categories', 'About'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center justify-around pt-4 border-t border-gray-200">
              <button className="flex flex-col items-center space-y-1 text-gray-600">
                <Heart className="h-5 w-5" />
                <span className="text-xs">Wishlist</span>
              </button>
              <button className="flex flex-col items-center space-y-1 text-gray-600">
                <User className="h-5 w-5" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
