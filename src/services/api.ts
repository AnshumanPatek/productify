import axios from 'axios';
import type { Product, ProductsResponse, Category } from '@/types/product';

const BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const productApi = {
  // Get all products with pagination
  getProducts: async (limit = 20, skip = 0): Promise<ProductsResponse> => {
    const response = await api.get('/products', {
      params: { limit, skip },
    });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (
    category: string,
    limit = 20,
    skip = 0
  ): Promise<ProductsResponse> => {
    const response = await api.get(`/products/category/${category}`, {
      params: { limit, skip },
    });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Search products
  searchProducts: async (
    query: string,
    limit = 20,
    skip = 0
  ): Promise<ProductsResponse> => {
    const response = await api.get('/products/search', {
      params: { q: query, limit, skip },
    });
    return response.data;
  },
};

export default api;
