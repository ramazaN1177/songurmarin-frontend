import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/client';
import type { Product, Brand } from '../types';

interface ProductsPageProps {
  onOpenQuoteModal: (productTitle?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenQuoteModal }) => {
  const { t, getField } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [pData, bData] = await Promise.all([
        apiService.getProducts(),
        apiService.getBrands()
      ]);
      setProducts(pData);
      setBrands(bData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProducts = selectedBrandSlug === 'all'
    ? products
    : products.filter(p => {
        const brand = brands.find(b => b.slug === selectedBrandSlug);
        return brand ? p.brandId === brand.id : true;
      });

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-700" />
            <span>{t('navProducts')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
            Mobil Vinç & Marin Ekipman Ürünlerimiz
          </h1>
          <p className="text-slate-600 text-base font-light">
            Marina, liman ve tersanelerin tüm ihtiyacını karşılayan 30 tondan 1000 tona kadar mobil boat hoist ve hidrolik bot taşıyıcılar.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setSelectedBrandSlug('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedBrandSlug === 'all'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-700 hover:text-blue-700 border border-slate-200'
            }`}
          >
            Tüm Markalar ({products.length})
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrandSlug(b.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedBrandSlug === b.slug
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:text-blue-700 border border-slate-200'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Ürünler yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {prod.primaryImage ? (
                      <img
                        src={prod.primaryImage}
                        alt={getField(prod, 'title')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-slate-400 bg-slate-100/80 w-full h-full">
                        <Layers className="w-10 h-10 stroke-[1.5] text-slate-300 mb-2" />
                        <span className="text-[11px] font-medium text-slate-400">Görsel Eklenmedi</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 font-heading group-hover:text-blue-700 transition-colors">
                      {getField(prod, 'title')}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {getField(prod, 'summary')}
                    </p>

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
        )}

      </div>
    </div>
  );
};
