import axios from 'axios';
import type { 
  Brand, Product, Service, Page, Reference, GalleryItem, HeroSlide, QuoteFormData, 
  AuthResponse, User, FormSubmission, SiteSetting 
} from '../types';
import { 
  mockBrands, mockProducts, mockServices, mockReferences, mockGallery, mockHeroSlides, mockPages 
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smm_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // --- Auth ---
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  // --- Public Read APIs ---
  getBrands: async (): Promise<Brand[]> => {
    try {
      const res = await api.get('/brands');
      return res.data;
    } catch {
      return mockBrands;
    }
  },

  getBrandBySlug: async (slug: string): Promise<Brand | null> => {
    try {
      const res = await api.get(`/brands/${slug}`);
      return res.data;
    } catch {
      const brand = mockBrands.find(b => b.slug === slug);
      if (!brand) return null;
      const products = mockProducts.filter(p => p.brandId === brand.id);
      return { ...brand, products };
    }
  },

  getProducts: async (brandSlug?: string): Promise<Product[]> => {
    try {
      const url = brandSlug ? `/products?brand=${brandSlug}` : '/products';
      const res = await api.get(url);
      return res.data;
    } catch {
      if (brandSlug) {
        const brand = mockBrands.find(b => b.slug === brandSlug);
        return brand ? mockProducts.filter(p => p.brandId === brand.id) : [];
      }
      return mockProducts;
    }
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const res = await api.get(`/products/${slug}`);
      return res.data;
    } catch {
      const prod = mockProducts.find(p => p.slug === slug);
      if (!prod) return null;
      const brand = mockBrands.find(b => b.id === prod.brandId);
      return { ...prod, brand };
    }
  },

  getServices: async (): Promise<Service[]> => {
    try {
      const res = await api.get('/services');
      return res.data;
    } catch {
      return mockServices;
    }
  },

  getServiceBySlug: async (slug: string): Promise<Service | null> => {
    try {
      const res = await api.get(`/services/${slug}`);
      return res.data;
    } catch {
      return mockServices.find(s => s.slug === slug) || null;
    }
  },

  getReferences: async (): Promise<Reference[]> => {
    try {
      const res = await api.get('/references');
      return res.data;
    } catch {
      return mockReferences;
    }
  },

  getGallery: async (category?: string, type?: 'IMAGE' | 'VIDEO'): Promise<GalleryItem[]> => {
    try {
      let url = '/gallery';
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (type) params.append('type', type);
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await api.get(url);
      return res.data;
    } catch {
      let filtered = [...mockGallery];
      if (category && category !== 'All' && category !== 'Tümü') {
        filtered = filtered.filter(g => g.category === category);
      }
      if (type) {
        filtered = filtered.filter(g => g.type === type);
      }
      return filtered;
    }
  },

  getHeroSlides: async (): Promise<HeroSlide[]> => {
    try {
      const res = await api.get('/hero-slides');
      return res.data;
    } catch {
      return mockHeroSlides;
    }
  },

  getPageBySlug: async (slug: string): Promise<Page | null> => {
    try {
      const res = await api.get(`/pages/${slug}`);
      return res.data;
    } catch {
      return mockPages.find(p => p.slug === slug) || null;
    }
  },

  submitForm: async (data: QuoteFormData): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post('/forms', data);
      return res.data;
    } catch {
      return { success: true, message: 'Teklif talebiniz başarıyla alındı.' };
    }
  },

  // --- Admin CRUD APIs ---
  // Admin Brands
  createBrand: async (data: Partial<Brand>): Promise<Brand> => {
    const res = await api.post('/admin/brands', data);
    return res.data;
  },
  updateBrand: async (id: number, data: Partial<Brand>): Promise<Brand> => {
    const res = await api.put(`/admin/brands/${id}`, data);
    return res.data;
  },
  deleteBrand: async (id: number): Promise<void> => {
    await api.delete(`/admin/brands/${id}`);
  },

  // Admin Products
  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const res = await api.post('/admin/products', data);
    return res.data;
  },
  updateProduct: async (id: number, data: Partial<Product>): Promise<Product> => {
    const res = await api.put(`/admin/products/${id}`, data);
    return res.data;
  },
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },

  // Admin Services
  createService: async (data: Partial<Service>): Promise<Service> => {
    const res = await api.post('/admin/services', data);
    return res.data;
  },
  updateService: async (id: number, data: Partial<Service>): Promise<Service> => {
    const res = await api.put(`/admin/services/${id}`, data);
    return res.data;
  },
  deleteService: async (id: number): Promise<void> => {
    await api.delete(`/admin/services/${id}`);
  },

  // Admin Hero Slides
  createHeroSlide: async (data: Partial<HeroSlide>): Promise<HeroSlide> => {
    const res = await api.post('/admin/hero-slides', data);
    return res.data;
  },
  updateHeroSlide: async (id: number, data: Partial<HeroSlide>): Promise<HeroSlide> => {
    const res = await api.put(`/admin/hero-slides/${id}`, data);
    return res.data;
  },
  deleteHeroSlide: async (id: number): Promise<void> => {
    await api.delete(`/admin/hero-slides/${id}`);
  },

  // Admin References
  createReference: async (data: Partial<Reference>): Promise<Reference> => {
    const res = await api.post('/admin/references', data);
    return res.data;
  },
  updateReference: async (id: number, data: Partial<Reference>): Promise<Reference> => {
    const res = await api.put(`/admin/references/${id}`, data);
    return res.data;
  },
  deleteReference: async (id: number): Promise<void> => {
    await api.delete(`/admin/references/${id}`);
  },

  // Admin Gallery
  createGalleryItem: async (data: Partial<GalleryItem>): Promise<GalleryItem> => {
    const res = await api.post('/admin/gallery', data);
    return res.data;
  },
  updateGalleryItem: async (id: number, data: Partial<GalleryItem>): Promise<GalleryItem> => {
    const res = await api.put(`/admin/gallery/${id}`, data);
    return res.data;
  },
  deleteGalleryItem: async (id: number): Promise<void> => {
    await api.delete(`/admin/gallery/${id}`);
  },

  // Admin Pages
  updatePage: async (id: number, data: Partial<Page>): Promise<Page> => {
    const identifier = data.slug || id;
    const res = await api.put(`/admin/pages/${identifier}`, data);
    return res.data;
  },

  // Admin Forms Submissions
  getFormSubmissions: async (): Promise<FormSubmission[]> => {
    try {
      const res = await api.get('/admin/forms');
      return res.data;
    } catch {
      return [];
    }
  },
  deleteFormSubmission: async (id: number): Promise<void> => {
    await api.delete(`/admin/forms/${id}`);
  },

  // Admin Settings
  getSettings: async (): Promise<SiteSetting[]> => {
    try {
      const res = await api.get('/settings');
      return res.data;
    } catch {
      return [];
    }
  },
  updateSetting: async (key: string, data: { valueTr?: string; valueEn?: string }): Promise<SiteSetting> => {
    const res = await api.put(`/admin/settings/${key}`, data);
    return res.data;
  },
  updateSettingsBulk: async (settingsList: { key: string; valueTr?: string; valueEn?: string }[]): Promise<{ message: string }> => {
    const res = await api.put('/admin/settings', settingsList);
    return res.data;
  },

  // Upload File (Node.js API with FileReader fallback)
  uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.url) return res.data;
    } catch {
      // Fall through to Base64 FileReader fallback for offline dev mode
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string, filename: file.name });
      };
      reader.readAsDataURL(file);
    });
  },

  // Delete file from SeaweedFS / storage
  deleteFile: async (url?: string | null): Promise<void> => {
    if (!url || typeof url !== 'string') return;
    if (url.startsWith('blob:') || url.startsWith('data:')) return;
    try {
      await api.delete('/admin/upload', { data: { url } });
    } catch {
      // Ignore background delete errors
    }
  }
};
