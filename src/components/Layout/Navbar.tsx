import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, Menu, X, ShieldCheck, FileText, Award, Layers, 
  Anchor, Wrench, Package, ArrowRight, Sparkles, Truck, Compass, Phone
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

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
  const { t, language, setLanguage } = useLanguage();
  const { getSetting } = useSettings();
  const phone = getSetting('phone', language, '+90 (216) 123 45 67');
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileAccordion(null);
  };

  const toggleMobileAccordion = (name: string) => {
    setMobileAccordion(mobileAccordion === name ? null : name);
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
                  ['/kurumsal/hakkimizda', '/kurumsal/misyon-vizyon', '/referanslar', '/kvkk'].includes(location.pathname)
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
                      to="/referanslar"
                      onClick={closeMobileMenu}
                      className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-sky-50/80 transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 group-hover/item:bg-amber-600 group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 flex items-center gap-1">
                          <span>{t('navReferences')}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                          500+ tamamlanan proje ve teslimat başarısı
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
                    Temsil Ettiğimiz Markalar
                  </div>

                  <Link
                    to="/markalar/cimolai-technology"
                    onClick={closeMobileMenu}
                    className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 transition-all"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block">
                        Cimolai Technology
                      </span>
                      <span className="text-[11px] text-slate-500 block font-normal">
                        Mobil Boat Hoist & Dev Vinçler (İtalya)
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                  </Link>

                  <Link
                    to="/markalar/marine-crane-co"
                    onClick={closeMobileMenu}
                    className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 transition-all"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block">
                        Marine Crane Co.
                      </span>
                      <span className="text-[11px] text-slate-500 block font-normal">
                        Güverte & Portatif Vinç Sistemleri
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                  </Link>

                  <Link
                    to="/markalar/heavy-transporter-systems"
                    onClick={closeMobileMenu}
                    className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 transition-all"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block">
                        Heavy Transporter Systems
                      </span>
                      <span className="text-[11px] text-slate-500 block font-normal">
                        SPMT Modüler Taşıyıcı Arabalar
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                  </Link>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to="/markalar"
                      onClick={closeMobileMenu}
                      className="w-full text-center text-xs font-bold text-blue-700 hover:text-blue-800 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Tüm Markaları İnceleyin</span>
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
                    <span>Öne Çıkan Ekipman Grupları</span>
                    <span className="text-sky-600 text-[10px] font-bold">1000 Tona Kadar</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/urunler/mbh-800-mobil-tekne-kaldirma-vinci"
                      onClick={closeMobileMenu}
                      className="group/item p-3 rounded-xl hover:bg-sky-50/80 border border-slate-100 hover:border-sky-200 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white flex items-center justify-center mb-2 transition-colors">
                        <Anchor className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block leading-tight">
                        MBH 800 Boat Hoist
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        800 Ton Kapasiteli Süperyat Vincı
                      </span>
                    </Link>

                    <Link
                      to="/urunler/mbh-300-mobil-tekne-kaldirma-vinci"
                      onClick={closeMobileMenu}
                      className="group/item p-3 rounded-xl hover:bg-sky-50/80 border border-slate-100 hover:border-sky-200 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 group-hover/item:bg-sky-600 group-hover/item:text-white flex items-center justify-center mb-2 transition-colors">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block leading-tight">
                        MBH 300 Tekne Vincı
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Marinalar için Esnek 300T Vinc
                      </span>
                    </Link>

                    <Link
                      to="/urunler"
                      onClick={closeMobileMenu}
                      className="group/item p-3 rounded-xl hover:bg-sky-50/80 border border-slate-100 hover:border-sky-200 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white flex items-center justify-center mb-2 transition-colors">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block leading-tight">
                        SPMT Taşıyıcılar
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Kendinden Tahrikli Modüler Arabalar
                      </span>
                    </Link>

                    <Link
                      to="/urunler"
                      onClick={closeMobileMenu}
                      className="group/item p-3 rounded-xl hover:bg-sky-50/80 border border-slate-100 hover:border-sky-200 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 group-hover/item:bg-teal-600 group-hover/item:text-white flex items-center justify-center mb-2 transition-colors">
                        <Compass className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block leading-tight">
                        Marin & Güverte Vinçleri
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Mafsallı Boom ve Hidrolik Vinçler
                      </span>
                    </Link>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/urunler"
                      onClick={closeMobileMenu}
                      className="w-full text-center text-xs font-bold text-white py-2 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Tüm Ürün Kataloğunu İncele</span>
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
                    Mühendislik & Teknik Servis
                  </div>

                  <Link
                    to="/hizmetler/satis-oncesi-kesif-projelendirme"
                    onClick={closeMobileMenu}
                    className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 transition-all"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block">
                        Satış Öncesi Keşif & Projelendirme
                      </span>
                      <span className="text-[11px] text-slate-500 block font-normal">
                        Rıhtım ve havuz yapısına özel planlama
                      </span>
                    </div>
                    <Wrench className="w-4 h-4 text-blue-600 opacity-60 group-hover/item:opacity-100 transition-opacity" />
                  </Link>

                  <Link
                    to="/hizmetler/periyodik-bakim-7-24-teknik-servis"
                    onClick={closeMobileMenu}
                    className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 transition-all"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block">
                        7/24 Teknik Servis & Bakım
                      </span>
                      <span className="text-[11px] text-slate-500 block font-normal">
                        Saha mühendislik ve arıza desteği
                      </span>
                    </div>
                    <Wrench className="w-4 h-4 text-blue-600 opacity-60 group-hover/item:opacity-100 transition-opacity" />
                  </Link>

                  <Link
                    to="/hizmetler/orijinal-yedek-parca-temini"
                    onClick={closeMobileMenu}
                    className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 transition-all"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block">
                        Orijinal Yedek Parça
                      </span>
                      <span className="text-[11px] text-slate-500 block font-normal">
                        Stoktan hızlı ve garantili parça temini
                      </span>
                    </div>
                    <Wrench className="w-4 h-4 text-blue-600 opacity-60 group-hover/item:opacity-100 transition-opacity" />
                  </Link>

                  <Link
                    to="/hizmetler/sertifikali-yuk-testi-belgelendirme"
                    onClick={closeMobileMenu}
                    className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 transition-all"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-blue-700 block">
                        Sertifikalı Yük Testi (SWL)
                      </span>
                      <span className="text-[11px] text-slate-500 block font-normal">
                        Yıllık ağırlık testi & raporlama
                      </span>
                    </div>
                    <Wrench className="w-4 h-4 text-blue-600 opacity-60 group-hover/item:opacity-100 transition-opacity" />
                  </Link>
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
                  to="/referanslar"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  {t('navReferences')}
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
                <Link
                  to="/markalar/cimolai-technology"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  Cimolai Technology
                </Link>
                <Link
                  to="/markalar/marine-crane-co"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  Marine Crane Co.
                </Link>
                <Link
                  to="/markalar/heavy-transporter-systems"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  Heavy Transporter Systems
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
                <Link
                  to="/urunler/mbh-800-mobil-tekne-kaldirma-vinci"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  MBH 800 Mobil Boat Hoist
                </Link>
                <Link
                  to="/urunler/mbh-300-mobil-tekne-kaldirma-vinci"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  MBH 300 Mobil Tekne Vincı
                </Link>
                <Link
                  to="/urunler"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  Tüm Ürün Kataloğu
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
                <Link
                  to="/hizmetler/satis-oncesi-kesif-projelendirme"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  Satış Öncesi Keşif & Projelendirme
                </Link>
                <Link
                  to="/hizmetler/periyodik-bakim-7-24-teknik-servis"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  7/24 Teknik Servis & Bakım
                </Link>
                <Link
                  to="/hizmetler/orijinal-yedek-parca-temini"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  Orijinal Yedek Parça Temini
                </Link>
                <Link
                  to="/hizmetler/sertifikali-yuk-testi-belgelendirme"
                  onClick={closeMobileMenu}
                  className="block text-xs font-semibold text-slate-700 hover:text-blue-700 py-1.5"
                >
                  Sertifikalı SWL Yük Testi
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
