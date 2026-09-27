import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ShieldCheck, Send } from 'lucide-react';
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
      const data = await apiService.getProductBySlug(slug);
      setProduct(data);
      if (data?.primaryImage) {
        setActiveImage(data.primaryImage);
      } else if (data?.images && data.images.length > 0) {
        setActiveImage(data.images[0].imageUrl);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Ürün detayları yükleniyor...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-32 text-center text-slate-900 space-y-4">
        <h2 className="text-2xl font-bold font-heading">Ürün Bulunamadı</h2>
        <p className="text-slate-600">Aradığınız ürün kataloglarımızda bulunamadı.</p>
        <Link to="/urunler" className="inline-flex items-center gap-2 text-blue-700 font-bold">
          <ArrowLeft className="w-4 h-4" /> Tüm Ürünlere Dön
        </Link>
      </div>
    );
  }

  const title = getField(product, 'title');
  const summary = getField(product, 'summary');
  const content = getField(product, 'content');

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <Link to="/urunler" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Ürün Listesine Dön</span>
        </Link>

        {/* Top Grid: Image gallery & main specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Images Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xl flex items-center justify-center">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-100/80 w-full h-full">
                  <ShieldCheck className="w-16 h-16 stroke-[1.5] text-slate-300 mb-3" />
                  <span className="text-sm font-medium text-slate-400">Ürün görseli bulunmuyor</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.imageUrl)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img.imageUrl ? 'border-blue-600 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Overview & Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{product.brand?.name || 'Yetkili Temsilcilik'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading leading-tight">{title}</h1>
            <p className="text-slate-600 text-sm leading-relaxed">{summary}</p>

            {/* Actions */}
            <div className="pt-4 space-y-3">
              <button
                onClick={() => onOpenQuoteModal(title)}
                className="w-full bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Bu Ürün İçin Teklif Alın</span>
              </button>

              {product.catalogPdfUrl && (
                <a
                  href={product.catalogPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-white hover:bg-slate-100 text-slate-800 font-semibold py-3 px-6 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-sm transition-all"
                >
                  <Download className="w-4 h-4 text-blue-700" />
                  <span>{t('downloadCatalog')}</span>
                </a>
              )}
            </div>

            {/* Key Specs Card */}
            {product.specsJson && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">Teknik Özellikler</h3>
                <div className="space-y-2.5 text-xs">
                  {Object.entries(product.specsJson).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">{k}</span>
                      <span className="font-bold text-slate-900">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Detailed HTML Content */}
        {content && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 font-heading">Ürün Detayı ve Açıklamalar</h2>
            <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}

      </div>
    </div>
  );
};
