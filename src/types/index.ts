export type Language = 'tr' | 'en';

export interface Page {
  id: number;
  slug: string;
  titleTr: string;
  titleEn: string;
  summaryTr?: string | null;
  summaryEn?: string | null;
  contentTr: string;
  contentEn: string;
  imageUrl?: string | null;
  seoTitleTr?: string | null;
  seoTitleEn?: string | null;
  seoDescTr?: string | null;
  seoDescEn?: string | null;
}

export interface Brand {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
  descriptionTr: string | null;
  descriptionEn: string | null;
  orderIndex: number;
  isActive: boolean;
  products?: Product[];
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface Product {
  id: number;
  brandId: number;
  brand?: Brand;
  slug: string;
  titleTr: string;
  titleEn: string;
  summaryTr: string | null;
  summaryEn: string | null;
  contentTr: string | null;
  contentEn: string | null;
  specsJson: Record<string, string | number> | null;
  catalogPdfUrl: string | null;
  featured: boolean;
  orderIndex: number;
  isActive: boolean;
  images?: ProductImage[];
  primaryImage?: string | null;
}

export interface Service {
  id: number;
  slug: string;
  titleTr: string;
  titleEn: string;
  summaryTr: string | null;
  summaryEn: string | null;
  contentTr: string | null;
  contentEn: string | null;
  iconName: string | null;
  imageUrl: string | null;
  orderIndex: number;
  isActive: boolean;
}

export interface GalleryItem {
  id: number;
  type: 'IMAGE' | 'VIDEO';
  titleTr: string | null;
  titleEn: string | null;
  descriptionTr?: string | null;
  descriptionEn?: string | null;
  mediaUrl: string;
  imageUrl?: string | null;
  thumbnailUrl: string | null;
  category: string;
  orderIndex: number;
  isActive: boolean;
  isPublished?: boolean;
}

export interface HeroSlide {
  id: number;
  titleTr: string | null;
  titleEn: string | null;
  subtitleTr: string | null;
  subtitleEn: string | null;
  imageUrl: string;
  buttonTextTr: string | null;
  buttonTextEn: string | null;
  buttonUrl: string | null;
  orderIndex: number;
  isActive: boolean;
}

export interface SiteSetting {
  id: number;
  key: string;
  valueTr: string | null;
  valueEn: string | null;
}

export interface QuoteFormData {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  productOrService?: string;
}

export interface FormSubmission extends QuoteFormData {
  id: number;
  isRead?: boolean;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'SUPERADMIN' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

