import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, ShieldCheck, Send, 
  ChevronRight, Package, MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/client';
import type { Product } from '../types';

interface ProductDetailPageProps {
  onOpenQuoteModal: (productTitle?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onOpenQuoteModal }) => {
  const { slug } = useParams<{ slug: string }>();
  const { getField, t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await apiService.getProductBySlug(slug);
        setProduct(data);
        if (data?.primaryImage) {
          setActiveImage(data.primaryImage);
        } else if (data?.images && data.images.length > 0) {
          setActiveImage(data.images[0].imageUrl);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-36 text-center text-slate-500 bg-slate-50 min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-medium text-slate-600">{t('loadingDetails')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-36 text-center text-slate-900 space-y-5 bg-slate-50 min-h-screen">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black font-heading">{t('productNotFound')}</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto">{t('productNotFoundSub')}</p>
        <Link to="/urunler" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all">
          <ArrowLeft className="w-4 h-4" /> {t('backToProducts')}
        </Link>
      </div>
    );
  }

  const title = getField(product, 'title') || product.titleTr;
  const summary = getField(product, 'summary') || product.summaryTr;
  const content = getField(product, 'content') || product.contentTr || '';

  // Helper to format and render content properly whether it's HTML or plain text with bullets
  const renderFormattedContent = (raw: string) => {
    if (!raw) return null;

    const trimmed = raw.trim();
    const isHtml = /<[a-z][\s\S]*>/i.test(trimmed);

    if (isHtml) {
      return (
        <div 
          className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3 [&_ul]:space-y-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-slate-700 [&_li]:text-xs [&_li]:font-medium [&_li::marker]:text-blue-600 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:font-heading [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-900 [&_p]:text-slate-600"
          dangerouslySetInnerHTML={{ __html: trimmed }} 
        />
      );
    }

    // If plain text, convert bullets to distinct styled items with blue bullet dots
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    return (
      <div className="space-y-2 pt-1">
        {lines.map((line, idx) => {
          const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
          const cleanLine = isBullet ? line.replace(/^[•\-*]\s*/, '') : line;
          const isHeader = line.endsWith(':') || (line.toUpperCase() === line && line.length < 40);

          if (isHeader) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 text-xs sm:text-sm pt-2 pb-1 border-b border-slate-100 font-heading">
                {line}
              </h4>
            );
          }

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-3 py-1 text-xs text-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed font-medium">{cleanLine}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-xs text-slate-600 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-slate-50/70 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation Header */}
        <div className="flex items-center justify-between text-xs border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2 text-slate-500 overflow-hidden">
            <Link to="/" className="hover:text-blue-700 transition-colors font-medium shrink-0">{t('navHome')}</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300" />
            <Link to="/urunler" className="hover:text-blue-700 transition-colors font-medium shrink-0">{t('navProducts')}</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300" />
            <span className="font-bold text-slate-900 truncate">{title}</span>
          </div>

          <Link
            to="/urunler"
            className="hidden sm:inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-800 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('backToProducts')}</span>
          </Link>
        </div>

        {/* Main Product Section: Left Image, Right Specs & Details */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT: Image Box */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-[4/3] rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-2">
                    <ShieldCheck className="w-12 h-12 text-slate-300" />
                    <span className="text-xs font-semibold text-slate-400">{t('noImage')}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.imageUrl)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                        activeImage === img.imageUrl ? 'border-blue-600 shadow-sm ring-2 ring-blue-500/20' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Text, Details, Bullet Points */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Brand Chip */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{product.brand?.name || t('authorizedDistributor')}</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-tight">
                {title}
              </h1>

              {/* Summary */}
              {summary && (
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed border-l-2 border-blue-600 pl-3.5 py-0.5">
                  {summary}
                </p>
              )}

              {/* Specs and Bullet Points */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-heading">
                  {t('specsAndDetails')}
                </h3>

                {renderFormattedContent(content)}

                {/* Technical Specs Breakdown if provided in JSON */}
                {product.specsJson && Object.keys(product.specsJson).length > 0 && (
                  <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                    {Object.entries(product.specsJson).map(([k, v]) => (
                      <div key={k} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <span className="text-slate-500 text-[10px] uppercase font-semibold">{k}</span>
                        <span className="font-bold text-slate-900 text-xs mt-0.5">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BOTTOM CTA BUTTONS */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal(title)}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-xs transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('getQuoteButton')}</span>
                </button>

                <a
                  href="https://wa.me/905422169906?text=Merhaba,%20Songur%20Marin%20ürünü%20hakkında%20bilgi%20almak%20istiyorum."
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>{t('whatsappButton')}</span>
                </a>

                {product.catalogPdfUrl && (
                  <a
                    href={product.catalogPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('catalogButton')}</span>
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

