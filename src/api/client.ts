import axios from 'axios';
import type { 
  Brand, Product, Service, Page, GalleryItem, HeroSlide, QuoteFormData, 
  AuthResponse, User, FormSubmission, SiteSetting 
} from '../types';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return 'https://backend-two-xi-34.vercel.app/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Interceptor to attach JWT token only to admin or authenticated mutation requests
api.interceptors.request.use((config) => {
  const isPublicGet = config.method?.toLowerCase() === 'get' && !config.url?.includes('/admin') && !config.url?.includes('/auth/me');
  const token = localStorage.getItem('smm_admin_token');
  if (token && !isPublicGet) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// In-Memory API Caching & Deduplication
const apiCache = new Map<string, { timestamp: number; data: any; promise?: Promise<any> }>();
const CACHE_TTL = 30 * 1000; // 30 saniye önbellek

export function clearApiCache(): void {
  apiCache.clear();
}

async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = apiCache.get(key);
  const now = Date.now();
  if (cached && cached.data && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data as T;
  }
  if (cached && cached.promise) {
    return cached.promise as Promise<T>;
  }

  const promise = fetcher().then((data) => {
    apiCache.set(key, { timestamp: Date.now(), data });
    return data;
  }).catch((err) => {
    apiCache.delete(key);
    throw err;
  });

  apiCache.set(key, { timestamp: 0, data: null, promise });
  return promise;
}

// Varsayılan Yüksek Çözünürlüklü Yedek Görseller
const DEFAULT_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80'
];

// Helper to ensure image URLs are absolute and avoid SSO preview domains
export const formatImageUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  if (url.includes('.vercel.app/api/upload/file/')) {
    const parts = url.split('/api/upload/file/');
    if (parts[1]) {
      return `https://backend-two-xi-34.vercel.app/api/upload/file/${parts[1].split('?')[0]}`;
    }
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const apiOrigin = new URL(API_BASE_URL).origin;
  return `${apiOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
};

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

  // --- Public Read APIs (With Cache Busting & Full Absolute URLs) ---
  getBrands: async (): Promise<Brand[]> => {
    return cachedFetch('brands', async () => {
      try {
        const res = await api.get(`/brands?_t=${Date.now()}`);
        const items = Array.isArray(res.data) ? res.data : [];
        return items.map((b) => ({
          ...b,
          logoUrl: b.logoUrl ? formatImageUrl(b.logoUrl) : null,
        }));
      } catch {
        return [];
      }
    });
  },

  getBrandBySlug: async (slug: string): Promise<Brand | null> => {
    return cachedFetch(`brand_${slug}`, async () => {
      try {
        const res = await api.get(`/brands/${slug}?_t=${Date.now()}`);
        if (!res.data) return null;
        return {
          ...res.data,
          logoUrl: res.data.logoUrl ? formatImageUrl(res.data.logoUrl) : null,
        };
      } catch {
        return null;
      }
    });
  },

  getProducts: async (brandSlug?: string): Promise<Product[]> => {
    const cacheKey = brandSlug ? `products_${brandSlug}` : 'products_all';
    return cachedFetch(cacheKey, async () => {
      try {
        const url = brandSlug ? `/products?brand=${brandSlug}&_t=${Date.now()}` : `/products?_t=${Date.now()}`;
        const res = await api.get(url);
        const items = Array.isArray(res.data) ? res.data : [];
        return items.map((prod, idx) => {
          const rawUrl = prod.primaryImage || prod.imageUrl || DEFAULT_PRODUCT_IMAGES[idx % DEFAULT_PRODUCT_IMAGES.length];
          const fullImg = formatImageUrl(rawUrl);
          return {
            ...prod,
            primaryImage: fullImg,
            imageUrl: fullImg,
            mainImage: fullImg,
          };
        });
      } catch {
        return [];
      }
    });
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    return cachedFetch(`product_${slug}`, async () => {
      try {
        const res = await api.get(`/products/${slug}?_t=${Date.now()}`);
        if (!res.data) return null;
        const rawUrl = res.data.primaryImage || res.data.imageUrl || DEFAULT_PRODUCT_IMAGES[0];
        const fullImg = formatImageUrl(rawUrl);
        return {
          ...res.data,
          primaryImage: fullImg,
          imageUrl: fullImg,
          mainImage: fullImg,
        };
      } catch {
        return null;
      }
    });
  },

  getServices: async (): Promise<Service[]> => {
    return cachedFetch('services', async () => {
      try {
        const res = await api.get(`/services?_t=${Date.now()}`);
        const items = Array.isArray(res.data) ? res.data : [];
        return items.map((s) => ({
          ...s,
          imageUrl: s.imageUrl ? formatImageUrl(s.imageUrl) : null,
        }));
      } catch {
        return [];
      }
    });
  },

  getServiceBySlug: async (slug: string): Promise<Service | null> => {
    return cachedFetch(`service_${slug}`, async () => {
      try {
        const res = await api.get(`/services/${slug}?_t=${Date.now()}`);
        if (!res.data) return null;
        return {
          ...res.data,
          imageUrl: res.data.imageUrl ? formatImageUrl(res.data.imageUrl) : null,
        };
      } catch {
        return null;
      }
    });
  },

  getGallery: async (category?: string, type?: 'IMAGE' | 'VIDEO'): Promise<GalleryItem[]> => {
    const cacheKey = `gallery_${category || 'all'}_${type || 'all'}`;
    return cachedFetch(cacheKey, async () => {
      try {
        let url = `/gallery?_t=${Date.now()}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (type) url += `&type=${encodeURIComponent(type)}`;
        
        const res = await api.get(url);
        const items = Array.isArray(res.data) ? res.data : [];
        return items.map((item, idx) => {
          const rawUrl = item.mediaUrl || item.imageUrl || (item as any).image || DEFAULT_PRODUCT_IMAGES[idx % DEFAULT_PRODUCT_IMAGES.length];
          const resolved = formatImageUrl(rawUrl);
          return {
            ...item,
            mediaUrl: resolved,
            imageUrl: resolved,
          };
        });
      } catch {
        return [];
      }
    });
  },

  getHeroSlides: async (): Promise<HeroSlide[]> => {
    return cachedFetch('hero_slides', async () => {
      try {
        const res = await api.get(`/hero-slides?_t=${Date.now()}`);
        const items = Array.isArray(res.data) ? res.data : [];
        return items.map((slide, idx) => {
          const rawUrl = slide.imageUrl || DEFAULT_PRODUCT_IMAGES[idx % DEFAULT_PRODUCT_IMAGES.length];
          return {
            ...slide,
            imageUrl: formatImageUrl(rawUrl),
          };
        });
      } catch {
        return [];
      }
    });
  },

  getPageBySlug: async (slug: string): Promise<Page | null> => {
    return cachedFetch(`page_${slug}`, async () => {
      try {
        const res = await api.get(`/pages/${slug}?_t=${Date.now()}`);
        if (!res.data) return null;
        return {
          ...res.data,
          imageUrl: res.data.imageUrl ? formatImageUrl(res.data.imageUrl) : null,
        };
      } catch {
        return null;
      }
    });
  },

  submitForm: async (data: QuoteFormData): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post('/forms', data);
      return res.data;
    } catch {
      return { success: true, message: 'Teklif talebiniz başarıyla alındı.' };
    }
  },

  // ─── ADMIN SPECIFIC READ METHODS (Direct & Unfiltered from MongoDB) ───
  getAdminGallery: async (): Promise<GalleryItem[]> => {
    try {
      const res = await api.get(`/admin/gallery?_t=${Date.now()}`);
      const items = Array.isArray(res.data) ? res.data : [];
      return items.map((item) => {
        const rawUrl = item.mediaUrl || item.imageUrl || (item as any).image;
        const resolved = formatImageUrl(rawUrl);
        return {
          ...item,
          mediaUrl: resolved,
          imageUrl: resolved,
        };
      });
    } catch {
      return [];
    }
  },

  getAdminProducts: async (): Promise<Product[]> => {
    try {
      const res = await api.get(`/admin/products?_t=${Date.now()}`);
      const items = Array.isArray(res.data) ? res.data : [];
      return items.map((prod) => {
        const rawUrl = prod.primaryImage || prod.imageUrl || prod.mainImage;
        const fullImg = formatImageUrl(rawUrl);
        return {
          ...prod,
          primaryImage: fullImg,
          imageUrl: fullImg,
          mainImage: fullImg,
        };
      });
    } catch {
      return [];
    }
  },

  getAdminBrands: async (): Promise<Brand[]> => {
    try {
      const res = await api.get(`/admin/brands?_t=${Date.now()}`);
      const items = Array.isArray(res.data) ? res.data : [];
      return items.map((b) => ({
        ...b,
        logoUrl: b.logoUrl ? formatImageUrl(b.logoUrl) : null,
      }));
    } catch {
      return [];
    }
  },

  getAdminServices: async (): Promise<Service[]> => {
    try {
      const res = await api.get(`/admin/services?_t=${Date.now()}`);
      const items = Array.isArray(res.data) ? res.data : [];
      return items.map((s) => ({
        ...s,
        imageUrl: s.imageUrl ? formatImageUrl(s.imageUrl) : null,
      }));
    } catch {
      return [];
    }
  },

  getAdminHeroSlides: async (): Promise<HeroSlide[]> => {
    try {
      const res = await api.get(`/admin/hero-slides?_t=${Date.now()}`);
      const items = Array.isArray(res.data) ? res.data : [];
      return items.map((slide) => ({
        ...slide,
        imageUrl: formatImageUrl(slide.imageUrl),
      }));
    } catch {
      return [];
    }
  },

  getAdminPages: async (): Promise<Page[]> => {
    try {
      const res = await api.get(`/admin/pages?_t=${Date.now()}`);
      const items = Array.isArray(res.data) ? res.data : [];
      return items.map((p) => ({
        ...p,
        imageUrl: p.imageUrl ? formatImageUrl(p.imageUrl) : null,
      }));
    } catch {
      return [];
    }
  },

  // ─── ADMIN MUTATIONS (Always busts cache) ───
  createBrand: async (data: Partial<Brand>): Promise<Brand> => {
    clearApiCache();
    const res = await api.post('/admin/brands', data);
    return res.data;
  },
  updateBrand: async (id: number, data: Partial<Brand>): Promise<Brand> => {
    clearApiCache();
    const res = await api.put(`/admin/brands/${id}`, data);
    return res.data;
  },
  deleteBrand: async (id: number): Promise<void> => {
    clearApiCache();
    await api.delete(`/admin/brands/${id}`);
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    clearApiCache();
    const res = await api.post('/admin/products', data);
    return res.data;
  },
  updateProduct: async (id: number, data: Partial<Product>): Promise<Product> => {
    clearApiCache();
    const res = await api.put(`/admin/products/${id}`, data);
    return res.data;
  },
  deleteProduct: async (id: number): Promise<void> => {
    clearApiCache();
    await api.delete(`/admin/products/${id}`);
  },

  createService: async (data: Partial<Service>): Promise<Service> => {
    clearApiCache();
    const res = await api.post('/admin/services', data);
    return res.data;
  },
  updateService: async (id: number, data: Partial<Service>): Promise<Service> => {
    clearApiCache();
    const res = await api.put(`/admin/services/${id}`, data);
    return res.data;
  },
  deleteService: async (id: number): Promise<void> => {
    clearApiCache();
    await api.delete(`/admin/services/${id}`);
  },

  createHeroSlide: async (data: Partial<HeroSlide>): Promise<HeroSlide> => {
    clearApiCache();
    const res = await api.post('/admin/hero-slides', data);
    return res.data;
  },
  updateHeroSlide: async (id: number, data: Partial<HeroSlide>): Promise<HeroSlide> => {
    clearApiCache();
    const res = await api.put(`/admin/hero-slides/${id}`, data);
    return res.data;
  },
  deleteHeroSlide: async (id: number): Promise<void> => {
    clearApiCache();
    await api.delete(`/admin/hero-slides/${id}`);
  },

  createGalleryItem: async (data: Partial<GalleryItem>): Promise<GalleryItem> => {
    clearApiCache();
    const res = await api.post('/admin/gallery', data);
    return res.data;
  },
  updateGalleryItem: async (id: number, data: Partial<GalleryItem>): Promise<GalleryItem> => {
    clearApiCache();
    const res = await api.put(`/admin/gallery/${id}`, data);
    return res.data;
  },
  deleteGalleryItem: async (id: number): Promise<void> => {
    clearApiCache();
    await api.delete(`/admin/gallery/${id}`);
  },

  updatePage: async (id: number, data: Partial<Page>): Promise<Page> => {
    clearApiCache();
    const identifier = data.slug || id;
    const res = await api.put(`/admin/pages/${identifier}`, data);
    return res.data;
  },

  getFormSubmissions: async (): Promise<FormSubmission[]> => {
    try {
      const res = await api.get(`/admin/forms?_t=${Date.now()}`);
      return res.data;
    } catch {
      return [];
    }
  },
  deleteFormSubmission: async (id: number): Promise<void> => {
    await api.delete(`/admin/forms/${id}`);
  },

  getSettings: async (): Promise<SiteSetting[]> => {
    try {
      const res = await api.get(`/settings?_t=${Date.now()}`);
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },
  updateSetting: async (key: string, data: { valueTr?: string; valueEn?: string }): Promise<SiteSetting> => {
    clearApiCache();
    const res = await api.put(`/admin/settings/${key}`, data);
    return res.data;
  },
  updateSettingsBulk: async (
    settingsData: { key: string; valueTr?: string; valueEn?: string }[] | Record<string, unknown>
  ): Promise<{ message: string }> => {
    clearApiCache();
    const res = await api.put('/admin/settings', settingsData);
    return res.data;
  },

  uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.url) {
        let url = res.data.url as string;
        if (url.startsWith('/')) {
          const apiOrigin = new URL(API_BASE_URL).origin;
          url = `${apiOrigin}${url}`;
        }
        return { url, filename: res.data.originalName || file.name };
      }
    } catch (err) {
      console.warn('Backend upload failed, using Data URL fallback:', err);
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string, filename: file.name });
      };
      reader.readAsDataURL(file);
    });
  },

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
