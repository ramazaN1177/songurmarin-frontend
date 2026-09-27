import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types';
import { apiService } from '../api/client';

interface Translations {
  [key: string]: {
    tr: string;
    en: string;
  };
}

const translations: Translations = {
  // TopBar & Header
  phone: { tr: '+90 (216) 123 45 67', en: '+90 (216) 123 45 67' },
  email: { tr: 'info@songurmarin.com', en: 'info@songurmarin.com' },
  addressHeader: { tr: 'Tuzla, İstanbul - Türkiye', en: 'Tuzla, Istanbul - Turkey' },
  workingHours: { tr: 'Pzt - Cmt: 08:30 - 18:00', en: 'Mon - Sat: 08:30 - 18:00' },
  requestQuote: { tr: 'Teklif Alın', en: 'Get a Quote' },
  
  // Navigation
  navHome: { tr: 'Ana Sayfa', en: 'Home' },
  navCorporate: { tr: 'Kurumsal', en: 'Corporate' },
  navAboutUs: { tr: 'Hakkımızda', en: 'About Us' },
  navMissionVision: { tr: 'Misyon & Vizyon', en: 'Mission & Vision' },
  navReferences: { tr: 'Referanslar', en: 'References' },
  navKvkk: { tr: 'KVKK Aydınlatma', en: 'Privacy & KVKK' },
  navBrands: { tr: 'Markalarımız', en: 'Brands' },
  navProducts: { tr: 'Ürünlerimiz', en: 'Products' },
  navServices: { tr: 'Hizmetlerimiz', en: 'Services' },
  navGallery: { tr: 'Galeri', en: 'Gallery' },
  navContact: { tr: 'İletişim', en: 'Contact' },

  // Hero & Homepage Stats
  expYears: { tr: '25+ Yıllık Tecrübe', en: '25+ Years Experience' },
  expYearsSub: { tr: 'Denizcilik ve Ağır Sanayi Ekipmanları', en: 'Maritime & Heavy Industrial Equipment' },
  projectsCount: { tr: '500+ Tamamlanan Proje', en: '500+ Completed Projects' },
  projectsCountSub: { tr: 'Marina ve Tersane Kurulumları', en: 'Marina & Shipyard Installations' },
  brandsCount: { tr: 'Dünya Markaları', en: 'Global Brands' },
  brandsCountSub: { tr: 'Dünya Lideri Temsilcilikler', en: 'Global Brands & Representation' },
  support247: { tr: '7/24 Teknik Servis', en: '24/7 Technical Service' },
  support247Sub: { tr: 'Uzman Mühendislik Kadrosu', en: 'Expert Engineering Team' },

  // Section Headers
  sectionBrandsTitle: { tr: 'Temsil Ettiğimiz Dünya Markaları', en: 'Global Brands We Represent' },
  sectionBrandsSub: { tr: 'Denizcilik sektöründe dünya lideri üreticilerin Türkiye distribütörlüğü ve servis yetkilisi.', en: 'Turkey distributorship and service representative of world leading manufacturers in maritime.' },
  sectionProductsTitle: { tr: 'Öne Çıkan Ürünlerimiz', en: 'Featured Products' },
  sectionProductsSub: { tr: 'Marina, liman ve tersaneler için özel üretilmiş yüksek kapasiteli mobil vinç ve transfer sistemleri.', en: 'Custom high-capacity mobile boat hoists and handling systems for marinas, ports & shipyards.' },
  sectionServicesTitle: { tr: 'Hizmetlerimiz & Mühendislik', en: 'Our Services & Engineering' },
  sectionServicesSub: { tr: 'Satış öncesi keşiften kurulum ve 7/24 periyodik bakıma kadar uçtan uca uzman çözümler.', en: 'End-to-end expert solutions from pre-sale survey to installation and 24/7 maintenance.' },
  sectionGalleryTitle: { tr: 'Proje & Uygulama Galerisi', en: 'Project & Operation Gallery' },
  sectionGallerySub: { tr: 'Saha çalışmalarımız, teslimat anlarımız ve teknik montaj görüntülerimiz.', en: 'Our field operations, delivery highlights, and technical assembly imagery.' },
  sectionCtaTitle: { tr: 'Projeniz İçin Özel Teklif Alın', en: 'Request a Custom Quote for Your Project' },
  sectionCtaSub: { tr: 'Uzman mühendis ekibimiz marina ve tersane ihtiyaçlarınızı inceleyip en uygun çözümü sunsun.', en: 'Our expert engineering team is ready to analyze your marina & shipyard needs.' },

  // Buttons & Labels
  viewAllProducts: { tr: 'Tüm Ürünleri İnceleyin', en: 'View All Products' },
  viewAllServices: { tr: 'Tüm Hizmetler', en: 'All Services' },
  viewDetails: { tr: 'Detayları İncele', en: 'View Details' },
  downloadCatalog: { tr: 'Kataloğu İndir (PDF)', en: 'Download Catalog (PDF)' },
  filterAll: { tr: 'Tümü', en: 'All' },
  filterImages: { tr: 'Fotoğraflar', en: 'Photos' },
  filterVideos: { tr: 'Videolar', en: 'Videos' },
  categoryMarinas: { tr: 'Marina & Liman', en: 'Marinas & Ports' },
  categoryShipyard: { tr: 'Tersane & İmalat', en: 'Shipyard & Fabrication' },
  categoryService: { tr: 'Servis & Bakım', en: 'Service & Maintenance' },
  
  // Footer & Contact
  footerDesc: { tr: 'Songur Marin Makine; marin vinçleri, mobil boat hoist, bot taşıyıcılar ve ağır sanayi kaldırma ekipmanlarında güvenilir çözüm ortağınızdır.', en: 'Songur Marin Machinery is your reliable solution partner in marine hoists, mobile boat hoists, boat transporters, and heavy industrial lifting equipment.' },
  quickLinks: { tr: 'Hızlı Bağlantılar', en: 'Quick Links' },
  contactUs: { tr: 'İletişim Bilgileri', en: 'Contact Information' },
  rightsReserved: { tr: 'Tüm Hakları Saklıdır.', en: 'All Rights Reserved.' },
  
  // Form Labels
  formTitle: { tr: 'Bize Ulaşın / Teklif Formu', en: 'Contact Us / Quote Form' },
  formFullName: { tr: 'Adınız Soyadınız', en: 'Full Name' },
  formCompanyName: { tr: 'Firma Adı', en: 'Company Name' },
  formEmail: { tr: 'E-posta Adresiniz', en: 'Email Address' },
  formPhone: { tr: 'Telefon Numarası', en: 'Phone Number' },
  formSubject: { tr: 'Konu', en: 'Subject' },
  formMessage: { tr: 'Mesajınız / Proje Detayları', en: 'Your Message / Project Details' },
  formSend: { tr: 'Formu Gönder', en: 'Submit Request' },
  formSuccess: { tr: 'Talebiniz başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.', en: 'Your request has been sent successfully. We will get back to you shortly.' },

  // About & Home Teaser
  aboutTitle: { tr: 'Marina & Tersaneler İçin Uçtan Uca Mühendislik Çözümleri', en: 'End-to-End Engineering Solutions for Marinas & Shipyards' },
  aboutDesc: { tr: '25 yılı aşkın tecrübemizle, marin vinçleri, mobil boat hoist, bot taşıyıcılar ve ağır sanayi kaldırma ekipmanlarında Türkiye ve çevre coğrafyanın öncü firması olarak hizmet veriyoruz.', en: 'With over 25 years of experience, we serve as the leading company in Turkey and surrounding regions for marine cranes, mobile boat hoists, boat transporters, and heavy industrial lifting equipment.' },
  aboutFeature1: { tr: 'Satış Öncesi Projelendirme: Rıhtım ölçüleri ve havuz yapısına uygun vinç seçimi.', en: 'Pre-Sale Engineering: Crane selection tailored to dock dimensions and basin layout.' },
  aboutFeature2: { tr: 'Orijinal Yedek Parça: Stoktan hızlı yedek parça temini ve garanti.', en: 'Original Spare Parts: Fast spare parts delivery from stock with warranty.' },
  aboutFeature3: { tr: 'Sertifikalı Yük Testi: Yıllık SWL ağırlık testi ve periyodik bakım raporlaması.', en: 'Certified Load Testing: Annual SWL load testing and periodic maintenance reporting.' },
  maxCapVal: { tr: '1000 Ton', en: '1000 Tons' },
  maxCapLabel: { tr: 'Maks. Kaldırma Kapasitesi', en: 'Max Lifting Capacity' },
  maxCapSub: { tr: 'Mobil Boat Hoist & Vinç', en: 'Mobile Boat Hoist & Crane' },
  viewBrandProducts: { tr: 'Marka Ürünlerini Gör', en: 'View Brand Products' },
  representationTitle: { tr: 'Temsilcilik & Distribütörlük', en: 'Representation & Distributorship' },
  representationSub: { tr: 'Uluslararası Yetkili Temsilcilik', en: 'International Authorized Representation' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getField: <T extends Record<string, any>>(item: T | null | undefined, fieldName: string) => string;
  refreshSettings: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('smm_lang') as Language;
    return saved || 'tr';
  });

  const [dynamicSettings, setDynamicSettings] = useState<Record<string, { tr: string; en: string }>>({});

  const refreshSettings = async () => {
    try {
      const settings = await apiService.getSettings();
      if (Array.isArray(settings)) {
        const map: Record<string, { tr: string; en: string }> = {};
        settings.forEach((s) => {
          map[s.key] = {
            tr: s.valueTr || '',
            en: s.valueEn || s.valueTr || ''
          };
        });
        setDynamicSettings(map);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('smm_lang', lang);
  };

  const t = (key: string): string => {
    const settingKeyMap: Record<string, string> = {
      phone: 'phone',
      email: 'email',
      addressHeader: 'address',
      workingHours: 'working_hours'
    };

    const sKey = settingKeyMap[key];
    if (sKey && dynamicSettings[sKey]) {
      const val = dynamicSettings[sKey][language] || dynamicSettings[sKey].tr;
      if (val) return val;
    }

    if (translations[key]) {
      return translations[key][language] || translations[key].tr || key;
    }
    return key;
  };

  const getField = <T extends Record<string, any>>(item: T | null | undefined, fieldName: string): string => {
    if (!item) return '';
    const suffix = language === 'en' ? 'En' : 'Tr';
    const key = `${fieldName}${suffix}`;
    if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
      return String(item[key]);
    }
    const trKey = `${fieldName}Tr`;
    if (item[trKey]) return String(item[trKey]);
    return String(item[fieldName] || '');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getField, refreshSettings }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
