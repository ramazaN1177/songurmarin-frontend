import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, Menu, X, ShieldCheck, FileText, Layers, 
  Anchor, Wrench, Package, ArrowRight, Sparkles, Truck, Compass, Phone
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { apiService } from '../../api/client';
import type { Brand, Product, Service } from '../../types';

interface NavbarProps {
  onOpenQuoteModal: () => void;
}

// Flag TR SVG Icon
const FlagTR: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={`${className} rounded-full shadow-sm shrink-0`} viewBox="0 0 640 480">
    <path fill="#e30a17" d="M0 0h640v480H0z"/>
    <path fill="#fff" d="M407 240c0 66.27-53.73 120-120 120s-120-53.73-120-120 53.73-120 120-120 120 53.73 120 120z"/>
    <path fill="#e30a17" d="M413 240c0 53.02-42.98 96-96 96s-96-42.98-96-96 42.98-96 96-96 96 42.98 96 96z"/>
    <path fill="#fff" d="m409.8 240-35.8-11.6 22.1 29.5v-35.8l-22.1 29.5z"/>
  </svg>
);

// Flag EN SVG Icon
const FlagEN: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={`${className} rounded-full shadow-sm shrink-0`} viewBox="0 0 640 480">
    <path fill="#012169" d="M0 0h640v480H0z"/>
    <path fill="#FFF" d="m75 0 245 180L565 0h75v50L440 240l200 190v50h-75L320 300 75 480H0v-50l200-190L0 50V0h75z"/>
    <path fill="#C8102E" d="m424 240 216 162v38l-241-180h25zm-208 0L0 402v38l241-180h-25zm0 0L0 78V40l241 180h-25zm208 0L640 78V40L399 220h25z"/>
    <path fill="#FFF" d="M240 0v480h160V0H240zM0 160v160h640V160H0z"/>
    <path fill="#C8102E" d="M267 0v480h106V0H267zM0 187v106h640V187H0z"/>
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuoteModal }) => {
  const { t, language, setLanguage, getField } = useLanguage();
  const { getSetting } = useSettings();
  const phone = getSetting('phone', language, '+90 (216) 123 45 67');
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dynamic data from backend
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Track open dropdown for desktop hover
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // Track open mobile accordion
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, prodsData, servsData] = await Promise.all([
          apiService.getBrands(),
          apiService.getProducts(),
          apiService.getServices(),
        ]);
        setBrands(brandsData);
        setProducts(prodsData);
        setServices(servsData);
      } catch (err) {
        console.error('Failed to load dynamic navbar items from backend:', err);
      }
    };
    fetchData();
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileAccordion(null);
  };

  const toggleMobileAccordion = (name: string) => {
    setMobileAccordion(mobileAccordion === name ? null : name);
  };

  const getProductIcon = (index: number) => {
    const icons = [
      <Anchor key="1" className="w-4 h-4" />,
      <Package key="2" className="w-4 h-4" />,
      <Truck key="3" className="w-4 h-4" />,
      <Compass key="4" className="w-4 h-4" />
    ];
    return icons[index % icons.length];
  };

  const getServiceIcon = (iconName?: string | null) => {
    switch (iconName?.toLowerCase()) {
      case 'wrench': return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'shieldcheck': return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'settings': return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'layers': return <Layers className="w-4 h-4 text-sky-600" />;
      case 'truck': return <Truck className="w-4 h-4 text-indigo-600" />;
      case 'anchor': return <Anchor className="w-4 h-4 text-blue-600" />;
      default: return <Wrench className="w-4 h-4 text-blue-600" />;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-950/5 border-b border-slate-200/80' 
        : 'bg-white border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 my-auto group">
            <img 
              src="/songurmarinlogo.png" 
              alt="Songur Marin Logo" 
              className="h-10 sm:h-12 w-auto object-contain self-center group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="flex flex-col justify-center self-center">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors uppercase font-heading leading-none">
                SONGUR MARİN
              </span>
              <span className="text-[10px] text-blue-600 tracking-widest font-bold uppercase mt-0.5">
                Makine & Ekipman San.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
            
            {/* Home */}
            <Link
              to="/"
              className={`transition-colors hover:text-blue-600 ${
                isActive('/') ? 'text-blue-700 font-bold border-b-2 border-blue-600 pb-0.5' : 'text-slate-700'
              }`}
            >
              {t('navHome')}
            </Link>

            {/* 1. Kurumsal Dropdown (Corporate Mega Menu) */}
            <div 
              className="relative py-6 group"
              onMouseEnter={() => setActiveDropdown('corporate')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`flex items-center gap-1.5 transition-colors group-hover:text-blue-600 ${
                  ['/kurumsal/hakkimizda', '/kurumsal/misyon-vizyon', '/kvkk'].includes(location.pathname)
                    ? 'text-blue-700 font-bold border-b-2 border-blue-600 pb-0.5'
                    : 'text-slate-700'
                }`}
              >
                <span>{t('navCorporate')}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-300 ${
                  activeDropdown === 'corporate' ? 'rotate-180 text-blue-600' : ''
                }`} />
              </button>

              {/* Mega Panel */}
              <div className={`absolute top-full left-0 w-[540px] bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl p-4 z-50 transition-all duration-200 origin-top-left ${
                activeDropdown === 'corporate' 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}>
                {/* Top Arrow Pointer */}
                <div className="absolute -top-2 left-6 w-4 h-4 rotate-45 bg-white border-t border-l border-slate-200/90 rounded-tl-sm" />

                <div className="grid grid-cols-12 gap-3 relative z-10">
                  {/* Left Column: Menu Items */}
                  <div className="col-span-7 space-y-1">
                    <Link
                      to="/kurumsal/hakkimizda"
                      onClick={closeMobileMenu}
                      className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-sky-50/80 transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 flex items-center gap-1">
                          <span>{t('navAboutUs')}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                          25 yılı aşkın tecrübemiz ve mühendislik birikimimiz
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/kurumsal/misyon-vizyon"
                      onClick={closeMobileMenu}
                      className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-sky-50/80 transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 flex items-center gap-1">
                          <span>{t('navMissionVision')}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                          Sürdürülebilir marina ve ağır sanayi çözümleri
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/kvkk"
                      onClick={closeMobileMenu}
                      className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-sky-50/80 transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 flex items-center gap-1">
                          <span>{t('navKvkk')}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                          Yasal uyumluluk ve kişisel veri koruma politikası
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* Right Column: Featured Banner Card */}
                  <div className="col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 rounded-xl p-4 text-white flex flex-col justify-between relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="space-y-2 relative z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider border border-sky-400/30">
                        <Sparkles className="w-3 h-3 text-sky-400" />
                        Distribütörlük
                      </span>
                      <h4 className="text-xs font-bold text-white font-heading leading-tight pt-1">
                        Uluslararası Temsilcilik & Distribütörlük
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        1000 tona kadar mobil boat hoist ve ağır sanayi vinçlerinde tek yetkili satış & servis.
                      </p>
                    </div>

                    <Link
                      to="/kurumsal/hakkimizda"
                      onClick={closeMobileMenu}
                      className="mt-3 text-[11px] font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 transition-colors group/banner relative z-10"
                    >
                      <span>Kurumsal Profil</span>
                      <ArrowRight className="w-3 h-3 group-hover/banner:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Markalarımız Dropdown */}
            <div 
              className="relative py-6 group"
              onMouseEnter={() => setActiveDropdown('brands')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`flex items-center gap-1.5 transition-colors group-hover:text-blue-600 ${
                  location.pathname.startsWith('/markalar')
                    ? 'text-blue-700 font-bold border-b-2 border-blue-600 pb-0.5'
                    : 'text-slate-700'
                }`}
              >
                <span>{t('navBrands')}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-300 ${
                  activeDropdown === 'brands' ? 'rotate-180 text-blue-600' : ''
                }`} />
              </button>

              {/* Dropdown Menu Panel */}
              <div className={`absolute top-full left-0 w-80 bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl p-3 z-50 transition-all duration-200 origin-top-left ${
                activeDropdown === 'brands' 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}>
                <div className="absolute -top-2 left-6 w-4 h-4 rotate-45 bg-white border-t border-l border-slate-200/90 rounded-tl-sm" />

                <div className="space-y-1 relative z-10">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    {language === 'tr' ? 'Temsil Ettiğimiz Markalar' : 'Represented Brands'}
                  </div>

                  {brands.length > 0 ? (
                    brands.map((brand) => (
                      <Link
                        key={brand.id}
                        to="/markalar"
                        onClick={closeMobileMenu}
                        className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 transition-all"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block">
                            {brand.name}
                          </span>
                          <span className="text-[11px] text-slate-500 block font-normal line-clamp-1">
                            {getField(brand, 'description') || (language === 'tr' ? 'Yetkili Satış & Servis' : 'Authorized Sales & Service')}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0 ml-2" />
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-400 italic">
                      {language === 'tr' ? 'Markalar yükleniyor...' : 'Loading brands...'}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to="/markalar"
                      onClick={closeMobileMenu}
                      className="w-full text-center text-xs font-bold text-blue-700 hover:text-blue-800 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>{language === 'tr' ? 'Tüm Markaları İnceleyin' : 'View All Brands'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Ürünlerimiz Dropdown */}
            <div 
              className="relative py-6 group"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`flex items-center gap-1.5 transition-colors group-hover:text-blue-600 ${
                  location.pathname.startsWith('/urunler')
                    ? 'text-blue-700 font-bold border-b-2 border-blue-600 pb-0.5'
                    : 'text-slate-700'
                }`}
              >
                <span>{t('navProducts')}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-300 ${
                  activeDropdown === 'products' ? 'rotate-180 text-blue-600' : ''
                }`} />
              </button>

              {/* Products Dropdown Panel */}
              <div className={`absolute top-full left-0 w-[460px] bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl p-4 z-50 transition-all duration-200 origin-top-left ${
                activeDropdown === 'products' 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}>
                <div className="absolute -top-2 left-6 w-4 h-4 rotate-45 bg-white border-t border-l border-slate-200/90 rounded-tl-sm" />

                <div className="space-y-2 relative z-10">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>{language === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}</span>
                    <span className="text-sky-600 text-[10px] font-bold">1000 Tona Kadar</span>
                  </div>

                  {products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {products.slice(0, 4).map((prod, idx) => (
                        <Link
                          key={prod.id}
                          to={`/urunler/${prod.slug}`}
                          onClick={closeMobileMenu}
                          className="group/item p-3 rounded-xl hover:bg-sky-50/80 border border-slate-100 hover:border-sky-200 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white flex items-center justify-center mb-2 transition-colors overflow-hidden">
                              {prod.primaryImage ? (
                                <img src={prod.primaryImage} alt={getField(prod, 'title')} className="w-full h-full object-cover" />
                              ) : (
                                getProductIcon(idx)
                              )}
                            </div>
                            <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block leading-tight line-clamp-1">
                              {getField(prod, 'title') || prod.titleTr}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-1 line-clamp-2">
                              {getField(prod, 'summary') || prod.summaryTr || (language === 'tr' ? 'Detaylı bilgi için tıklayın' : 'Click for details')}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-400 italic">
                      {language === 'tr' ? 'Ürünler yükleniyor...' : 'Loading products...'}
                    </div>
                  )}

                  <div className="pt-2">
                    <Link
                      to="/urunler"
                      onClick={closeMobileMenu}
                      className="w-full text-center text-xs font-bold text-white py-2 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>{language === 'tr' ? 'Tüm Ürün Kataloğunu İncele' : 'View All Products'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Hizmetlerimiz Dropdown */}
            <div 
              className="relative py-6 group"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`flex items-center gap-1.5 transition-colors group-hover:text-blue-600 ${
                  location.pathname.startsWith('/hizmetler')
                    ? 'text-blue-700 font-bold border-b-2 border-blue-600 pb-0.5'
                    : 'text-slate-700'
                }`}
              >
                <span>{t('navServices')}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-300 ${
                  activeDropdown === 'services' ? 'rotate-180 text-blue-600' : ''
                }`} />
              </button>

              {/* Services Dropdown Panel */}
              <div className={`absolute top-full left-0 w-80 bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl p-3 z-50 transition-all duration-200 origin-top-left ${
                activeDropdown === 'services' 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}>
                <div className="absolute -top-2 left-6 w-4 h-4 rotate-45 bg-white border-t border-l border-slate-200/90 rounded-tl-sm" />

                <div className="space-y-1 relative z-10">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    {language === 'tr' ? 'Mühendislik & Teknik Servis' : 'Engineering & Technical Services'}
                  </div>

                  {services.length > 0 ? (
                    services.map((service) => (
                      <Link
                        key={service.id}
                        to={`/hizmetler/${service.slug}`}
                        onClick={closeMobileMenu}
                        className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 transition-all"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block truncate">
                            {getField(service, 'title') || service.titleTr}
                          </span>
                          <span className="text-[11px] text-slate-500 block font-normal line-clamp-1">
                            {getField(service, 'summary') || service.summaryTr}
                          </span>
                        </div>
                        <div className="shrink-0">
                          {getServiceIcon(service.iconName)}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-400 italic">
                      {language === 'tr' ? 'Hizmetler yükleniyor...' : 'Loading services...'}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to="/hizmetler"
                      onClick={closeMobileMenu}
                      className="w-full text-center text-xs font-bold text-blue-700 hover:text-blue-800 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>{language === 'tr' ? 'Tüm Hizmetleri İnceleyin' : 'View All Services'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <Link
              to="/galeri"
              className={`transition-colors hover:text-blue-600 ${
                isActive('/galeri') ? 'text-blue-700 font-bold border-b-2 border-blue-600 pb-0.5' : 'text-slate-700'
              }`}
            >
              {t('navGallery')}
            </Link>

            {/* Contact */}
            <Link
              to="/iletisim"
              className={`transition-colors hover:text-blue-600 ${
                isActive('/iletisim') ? 'text-blue-700 font-bold border-b-2 border-blue-600 pb-0.5' : 'text-slate-700'
              }`}
            >
              {t('navContact')}
            </Link>
          </nav>

          {/* Action Button: Get Quote */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onOpenQuoteModal}
              className="bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center gap-2"
            >
              <span>{t('requestQuote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-blue-700 hover:bg-slate-200 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className={`block px-4 py-2.5 rounded-xl font-semibold text-sm ${
              isActive('/') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('navHome')}
          </Link>

          {/* Mobile Accordion: Kurumsal */}
          <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
            <button
              onClick={() => toggleMobileAccordion('corporate')}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 hover:text-blue-700"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>{t('navCorporate')}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                mobileAccordion === 'corporate' ? 'rotate-180 text-blue-600' : ''
              }`} />
            </button>
            {mobileAccordion === 'corporate' && (
              <div className="px-4 pb-3 space-y-2 border-t border-slate-100 pt-2 bg-white">
                <Link
                  to="/kurumsal/hakkimizda"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  {t('navAboutUs')}
                </Link>
                <Link
                  to="/kurumsal/misyon-vizyon"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  {t('navMissionVision')}
                </Link>
                <Link
                  to="/kvkk"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  {t('navKvkk')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Accordion: Markalarımız */}
          <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
            <button
              onClick={() => toggleMobileAccordion('brands')}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 hover:text-blue-700"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>{t('navBrands')}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                mobileAccordion === 'brands' ? 'rotate-180 text-blue-600' : ''
              }`} />
            </button>
            {mobileAccordion === 'brands' && (
              <div className="px-4 pb-3 space-y-2 border-t border-slate-100 pt-2 bg-white">
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <Link
                      key={brand.id}
                      to="/markalar"
                      onClick={closeMobileMenu}
                      className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                    >
                      {brand.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-1">Yükleniyor...</p>
                )}
                <Link
                  to="/markalar"
                  onClick={closeMobileMenu}
                  className="block text-xs font-bold text-blue-600 hover:text-blue-800 pt-1 border-t border-slate-50"
                >
                  {language === 'tr' ? 'Tüm Markalar →' : 'All Brands →'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Accordion: Ürünlerimiz */}
          <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
            <button
              onClick={() => toggleMobileAccordion('products')}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 hover:text-blue-700"
            >
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-blue-600" />
                <span>{t('navProducts')}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                mobileAccordion === 'products' ? 'rotate-180 text-blue-600' : ''
              }`} />
            </button>
            {mobileAccordion === 'products' && (
              <div className="px-4 pb-3 space-y-2 border-t border-slate-100 pt-2 bg-white">
                {products.length > 0 ? (
                  products.slice(0, 5).map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/urunler/${prod.slug}`}
                      onClick={closeMobileMenu}
                      className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                    >
                      {getField(prod, 'title') || prod.titleTr}
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-1">Yükleniyor...</p>
                )}
                <Link
                  to="/urunler"
                  onClick={closeMobileMenu}
                  className="block text-xs font-bold text-blue-600 hover:text-blue-800 pt-1 border-t border-slate-50"
                >
                  {language === 'tr' ? 'Tüm Ürün Kataloğu →' : 'All Products →'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Accordion: Hizmetlerimiz */}
          <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
            <button
              onClick={() => toggleMobileAccordion('services')}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 hover:text-blue-700"
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>{t('navServices')}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                mobileAccordion === 'services' ? 'rotate-180 text-blue-600' : ''
              }`} />
            </button>
            {mobileAccordion === 'services' && (
              <div className="px-4 pb-3 space-y-2 border-t border-slate-100 pt-2 bg-white">
                {services.length > 0 ? (
                  services.map((service) => (
                    <Link
                      key={service.id}
                      to={`/hizmetler/${service.slug}`}
                      onClick={closeMobileMenu}
                      className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                    >
                      {getField(service, 'title') || service.titleTr}
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-1">Yükleniyor...</p>
                )}
                <Link
                  to="/hizmetler"
                  onClick={closeMobileMenu}
                  className="block text-xs font-bold text-blue-600 hover:text-blue-800 pt-1 border-t border-slate-50"
                >
                  {language === 'tr' ? 'Tüm Hizmetlerimiz →' : 'All Services →'}
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/galeri"
            onClick={closeMobileMenu}
            className={`block px-4 py-2.5 rounded-xl font-semibold text-sm ${
              isActive('/galeri') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('navGallery')}
          </Link>

          <Link
            to="/iletisim"
            onClick={closeMobileMenu}
            className={`block px-4 py-2.5 rounded-xl font-semibold text-sm ${
              isActive('/iletisim') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('navContact')}
          </Link>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => {
                closeMobileMenu();
                onOpenQuoteModal();
              }}
              className="w-full bg-gradient-to-r from-blue-700 to-sky-600 text-white font-bold py-3 rounded-xl shadow-md text-sm flex items-center justify-center gap-2"
            >
              <span>{t('requestQuote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Phone & Language Switcher */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <a 
                href={`tel:${phone.replace(/\s+/g, '')}`} 
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 px-3 py-2 rounded-xl"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>{phone}</span>
              </a>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setLanguage('tr')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'tr'
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FlagTR className="w-3.5 h-3.5" />
                  <span>TR</span>
                </button>
                
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FlagEN className="w-3.5 h-3.5" />
                  <span>EN</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
