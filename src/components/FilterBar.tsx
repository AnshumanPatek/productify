'use client';

import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import type { Category, SortOption, FilterState } from '@/types/product';

interface FilterBarProps {
  categories: Category[];
  filterState: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  loading?: boolean;
}

export default function FilterBar({
  categories,
  filterState,
  onFilterChange,
  loading = false,
}: FilterBarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'title-asc', label: 'Name A-Z' },
    { value: 'title-desc', label: 'Name Z-A' },
    { value: 'price-asc', label: 'Price Low to High' },
    { value: 'price-desc', label: 'Price High to Low' },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={filterState.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            icon={<Search className="h-4 w-4" />}
            disabled={loading}
          />
        </div>
        
        <div className="min-w-48">
          <select
            value={filterState.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 text-gray-900 bg-white"
            disabled={loading}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="min-w-48">
          <select
            value={filterState.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 text-gray-900 bg-white"
            disabled={loading}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        <Input
          placeholder="Search products..."
          value={filterState.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          icon={<Search className="h-4 w-4" />}
          disabled={loading}
        />
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex-1"
            disabled={loading}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              const currentIndex = sortOptions.findIndex(opt => opt.value === filterState.sortBy);
              const nextIndex = (currentIndex + 1) % sortOptions.length;
              onFilterChange({ sortBy: sortOptions[nextIndex].value });
            }}
            disabled={loading}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        
        {showMobileFilters && (
          <motion.div
            className="space-y-4 pt-4 border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterState.category}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 text-gray-900 bg-white"
                disabled={loading}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filterState.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 text-gray-900 bg-white"
                disabled={loading}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
