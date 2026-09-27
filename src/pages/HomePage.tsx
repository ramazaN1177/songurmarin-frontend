import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, ShieldCheck, Award, Wrench, 
  ArrowRight, Play, Eye, CheckCircle2, PhoneCall, Anchor, Settings, Globe 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { apiService } from '../api/client';
import type { HeroSlide, Brand, Product, Service, GalleryItem } from '../types';
import { LightboxModal } from '../components/LightboxModal';

// Import local images
import heroSlide1 from '../assets/hero/hero-slide-1.jpg';
import heroSlide2 from '../assets/hero/hero-slide-2.jpg';
import heroSlide3 from '../assets/hero/hero-slide-3.jpg';
import aboutSectionImg from '../assets/sections/about.jpg';
import ctaBannerImg from '../assets/sections/cta-banner.jpg';

const localHeroImages = [heroSlide1, heroSlide2, heroSlide3];

interface HomePageProps {
  onOpenQuoteModal: (productTitle?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuoteModal }) => {
  const { t, language, getField } = useLanguage();
  const { getSetting } = useSettings();
  const phone = getSetting('phone', language, '+90 542 216 99 06');

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
  const [brandSlideIndex, setBrandSlideIndex] = useState(0);

  const nextBrandSlide = () => {
    if (brands.length <= 3) return;
    setBrandSlideIndex((prev) => (prev + 1 >= brands.length ? 0 : prev + 1));
  };

  const prevBrandSlide = () => {
    if (brands.length <= 3) return;
    setBrandSlideIndex((prev) => (prev === 0 ? brands.length - 1 : prev - 1));
  };

  const getVisibleBrands = () => {
    if (brands.length <= 3) return brands;
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(brands[(brandSlideIndex + i) % brands.length]);
    }
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      const [sData, bData, pData, servData, gData] = await Promise.all([
        apiService.getHeroSlides(),
        apiService.getBrands(),
        apiService.getProducts(),
        apiService.getServices(),
        apiService.getGallery()
      ]);
      setSlides(sData);
      setBrands(bData);
      setProducts(pData);
      setServices(servData);
      setGalleryItems(gData.slice(0, 4));
    };
    fetchData();
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlideIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  // Hero slider auto-advance
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      goToSlide((currentSlideIndex + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides, currentSlideIndex, goToSlide]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="space-y-0 bg-slate-50">
      
      {/* HERO SECTION — High Contrast Ultra-Readable Cinematic Hero */}
      <section className="relative h-[72vh] min-h-[500px] max-h-[700px] overflow-hidden bg-slate-950">
        
        {/* Background Images with Ken Burns zoom effect */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ 
              opacity: index === currentSlideIndex ? 1 : 0,
              zIndex: index === currentSlideIndex ? 1 : 0
            }}
          >
            <img
              src={slide.imageUrl || localHeroImages[index] || localHeroImages[0]}
              alt={getField(slide, 'title') || ''}
              className="w-full h-full object-cover"
              style={{
                animation: index === currentSlideIndex ? 'kenBurns 12s ease-in-out forwards' : 'none',
              }}
            />
          </div>
        ))}
        
        {/* Left Dark Gradient Overlay for Maximum Text Contrast without darkening the full image */}
        <div 
          className="absolute inset-0 z-[2]" 
          style={{
            background: 'linear-gradient(to right, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.75) 45%, rgba(15,23,42,0.3) 75%, rgba(15,23,42,0.1) 100%)'
          }} 
        />
        {/* Top protection gradient */}
        <div 
          className="absolute inset-x-0 top-0 h-24 z-[2]" 
          style={{
            background: 'linear-gradient(to bottom, rgba(15,23,42,0.6), transparent)'
          }} 
        />
        {/* Bottom protection gradient */}
        <div 
          className="absolute inset-x-0 bottom-0 h-36 z-[2]" 
          style={{
            background: 'linear-gradient(to top, rgba(15,23,42,0.85), transparent)'
          }} 
        />

        {/* Main Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl space-y-6">
              
              {/* Animated Badge */}
              <div 
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest shadow-lg"
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  borderColor: 'rgba(56, 189, 248, 0.5)',
                  color: '#38bdf8',
                  backdropFilter: 'blur(16px)',
                  animation: 'fadeInDown 0.8s ease-out',
                }}
              >
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>SONGUR MARİN MAKİNE • Mobil Vinç & Ekipman Çözümleri</span>
              </div>

              {/* Main Title — Pure White, Sharp, High Contrast */}
              <h1 
                key={`title-${currentSlideIndex}`}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.12] font-heading drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                style={{
                  animation: 'fadeInUp 0.7s ease-out',
                }}
              >
                {currentSlide ? getField(currentSlide, 'title') : 'Denizcilik Sektöründe Güvenilir Çözüm Ortağınız'}
              </h1>

              {/* Subtitle — Crisp Bright Text */}
              <p 
                key={`sub-${currentSlideIndex}`}
                className="text-base sm:text-lg lg:text-xl text-slate-100 font-normal leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                style={{ animation: 'fadeInUp 0.7s ease-out 0.15s both' }}
              >
                {currentSlide ? getField(currentSlide, 'subtitle') : 'Marina, liman ve tersane projeleriniz için dünya standartlarında mobil vinç ve bot taşıyıcı sistemleri.'}
              </p>

              {/* CTA Buttons */}
              <div 
                className="pt-3 flex flex-wrap gap-4 items-center"
                style={{ animation: 'fadeInUp 0.7s ease-out 0.3s both' }}
              >
                <button
                  onClick={() => onOpenQuoteModal()}
                  className="group relative overflow-hidden bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-2xl shadow-sky-500/40 transition-all text-base flex items-center gap-2.5 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span className="relative z-10">{t('requestQuote')}</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <Link
                  to="/urunler"
                  className="group px-7 py-4 rounded-xl text-white font-semibold text-base transition-all flex items-center gap-2.5 border border-white/30 bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md shadow-lg"
                >
                  <span>{t('viewAllProducts')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-sky-400" />
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Floating Stats Badges (Desktop Right) */}
        <div className="hidden lg:flex absolute bottom-28 right-8 z-10 flex-col gap-3" style={{ animation: 'fadeInRight 1s ease-out 0.5s both' }}>
          {[
            { icon: <Anchor className="w-5 h-5" />, value: '25+', label: 'Yıl Tecrübe' },
            { icon: <Globe className="w-5 h-5" />, value: '500+', label: 'Tamamlanan Proje' },
            { icon: <Settings className="w-5 h-5" />, value: '1000T', label: 'Maks. Kapasite' },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/20 bg-slate-900/75 backdrop-blur-xl shadow-xl"
              style={{
                animation: `fadeInRight 0.6s ease-out ${0.6 + i * 0.15}s both`,
              }}
            >
              <div className="text-sky-400">{stat.icon}</div>
              <div>
                <span className="text-lg font-extrabold text-white font-heading">{stat.value}</span>
                <span className="text-[11px] text-slate-200 ml-1.5 font-medium">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex items-center justify-between">
              
              {/* Slide Indicator Dots */}
              <div className="flex items-center gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className="relative group py-2"
                    aria-label={`Slide ${index + 1}`}
                  >
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: index === currentSlideIndex ? '48px' : '18px',
                        background: index === currentSlideIndex
                          ? '#38bdf8'
                          : 'rgba(255,255,255,0.4)',
                      }}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-300 ml-3 font-mono tracking-widest">
                  {String(currentSlideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToSlide((currentSlideIndex - 1 + slides.length) % slides.length)}
                  className="p-3 rounded-xl border border-white/20 bg-slate-900/60 hover:bg-slate-900/90 text-white transition-all backdrop-blur-md"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => goToSlide((currentSlideIndex + 1) % slides.length)}
                  className="p-3 rounded-xl border border-white/20 bg-slate-900/60 hover:bg-slate-900/90 text-white transition-all backdrop-blur-md"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block" style={{ animation: 'bounce 2s infinite' }}>
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-1 h-2.5 rounded-full bg-sky-400" style={{ animation: 'scrollDot 2s infinite' }} />
          </div>
        </div>
      </section>

      {/* STATS BAR (Light Ice Blue) */}
      <section className="bg-blue-50 border-y border-blue-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-blue-200/80">
            
            <div className="pt-4 lg:pt-0 lg:px-4 space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-heading">25+</span>
              <p className="text-sm font-bold text-slate-900">{t('expYears')}</p>
              <p className="text-xs text-slate-600">{t('expYearsSub')}</p>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4 space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-heading">500+</span>
              <p className="text-sm font-bold text-slate-900">{t('projectsCount')}</p>
              <p className="text-xs text-slate-600">{t('projectsCountSub')}</p>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4 space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-heading">{t('maxCapVal')}</span>
              <p className="text-sm font-bold text-slate-900">{t('maxCapLabel')}</p>
              <p className="text-xs text-slate-600">{t('maxCapSub')}</p>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4 space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-heading">7/24</span>
              <p className="text-sm font-bold text-slate-900">{t('support247')}</p>
              <p className="text-xs text-slate-600">{t('support247Sub')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT SUMMARY TEASER (Clean White) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-xl relative group">
                <img
                  src={getSetting('home_about_image', language, aboutSectionImg)}
                  alt="Songur Marin Makine"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block bg-white border border-blue-200 p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-sm">{t('representationTitle')}</h4>
                    <p className="text-xs text-slate-500">{t('representationSub')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                <span>Songur Marin Makine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-heading leading-tight">
                {t('aboutTitle')}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t('aboutDesc')}
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{t('aboutFeature1')}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{t('aboutFeature2')}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{t('aboutFeature3')}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/kurumsal/hakkimizda"
                  className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <span>{t('viewDetails')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/referanslar"
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-200 transition-colors"
                >
                  <span>{t('navReferences')}</span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* BRANDS SHOWCASE (Light Gray background) */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-heading">{t('sectionBrandsTitle')}</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">{t('sectionBrandsSub')}</p>
            </div>

            {/* Slider Controls (Appears if brands > 3) */}
            {brands.length > 3 && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={prevBrandSlide}
                  className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 transition-all shadow-xs"
                  aria-label="Önceki Markalar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-slate-500 font-mono px-1">
                  {brandSlideIndex + 1} / {brands.length}
                </span>
                <button
                  type="button"
                  onClick={nextBrandSlide}
                  className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 transition-all shadow-xs"
                  aria-label="Sonraki Markalar"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getVisibleBrands().map((brand) => (
              <div
                key={brand.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-16 flex items-center gap-3">
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt={brand.name} className="h-12 w-auto max-w-[160px] object-contain" />
                    ) : (
                      <span className="text-2xl font-black text-blue-900 font-heading tracking-wider border-b-2 border-blue-600 pb-1">
                        {brand.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {getField(brand, 'description')}
                  </p>
                </div>

                <Link
                  to={`/urunler?brand=${brand.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors group"
                >
                  <span>{t('viewBrandProducts')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom Dots Indicator */}
          {brands.length > 3 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              {brands.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setBrandSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === brandSlideIndex ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Marka ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PRODUCTS (Clean White background) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-heading">{t('sectionProductsTitle')}</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">{t('sectionProductsSub')}</p>
            </div>
            <Link
              to="/urunler"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>{t('viewAllProducts')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                    <img
                      src={prod.primaryImage || heroSlide1}
                      alt={getField(prod, 'title')}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {prod.brand?.name || 'Yetkili Satış'}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 font-heading group-hover:text-blue-700 transition-colors line-clamp-2">
                      {getField(prod, 'title')}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {getField(prod, 'summary')}
                    </p>

                    {/* Specs snippet */}
                    {prod.specsJson && (
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                        {Object.entries(prod.specsJson).slice(0, 2).map(([k, v]) => (
                          <div key={k} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-slate-400 block text-[10px]">{k}</span>
                            <span className="font-bold text-slate-800">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                  <Link
                    to={`/urunler/${prod.slug}`}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1"
                  >
                    <span>{t('viewDetails')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => onOpenQuoteModal(getField(prod, 'title'))}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white text-xs font-bold transition-all border border-blue-200"
                  >
                    Teklif Al
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES (Ice Blue background) */}
      <section className="py-20 bg-blue-50/60 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-heading">{t('sectionServicesTitle')}</h2>
            <p className="text-sm sm:text-base text-slate-600">{t('sectionServicesSub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((serv) => (
              <div
                key={serv.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all hover:-translate-y-1 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">{getField(serv, 'title')}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{getField(serv, 'summary')}</p>
                </div>

                <Link
                  to={`/hizmetler/${serv.slug}`}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1 group"
                >
                  <span>Detaylı Bilgi</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW (Clean White) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-heading">{t('sectionGalleryTitle')}</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">{t('sectionGallerySub')}</p>
            </div>
            <Link
              to="/galeri"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>{t('navGallery')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryItems.map((gItem) => (
              <div
                key={gItem.id}
                onClick={() => setSelectedMedia(gItem)}
                className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:shadow-xl hover:border-blue-500 transition-all"
              >
                <img
                  src={gItem.thumbnailUrl || gItem.mediaUrl}
                  alt={getField(gItem, 'title') || 'Gallery Item'}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-blue-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center space-y-2">
                  {gItem.type === 'VIDEO' ? (
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 ml-1 fill-current" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 text-white border border-white/50 flex items-center justify-center">
                      <Eye className="w-6 h-6" />
                    </div>
                  )}
                  <span className="text-xs font-bold text-white line-clamp-2">{getField(gItem, 'title')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER (Cinematic with CTA image) */}
      <section className="py-20 text-white relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={getSetting('home_cta_image', language, ctaBannerImg)} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/80 to-indigo-950/85" />
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading">{t('sectionCtaTitle')}</h2>
          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto font-light">
            {t('sectionCtaSub')}
          </p>
          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => onOpenQuoteModal()}
              className="bg-sky-400 hover:bg-sky-300 text-blue-950 font-bold px-8 py-4 rounded-xl shadow-xl text-base transition-all hover:scale-105"
            >
              {t('requestQuote')}
            </button>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 text-base transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <PhoneCall className="w-5 h-5 text-sky-400" />
              <span>{phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal item={selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  );
};
