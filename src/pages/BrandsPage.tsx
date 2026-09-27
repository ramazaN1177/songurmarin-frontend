import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/client';
import type { Brand } from '../types';

export const BrandsPage: React.FC = () => {
  const { t, getField } = useLanguage();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const data = await apiService.getBrands();
      setBrands(data);
      setLoading(false);
    };
    fetchBrands();
  }, []);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>{t('navBrands')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
            Temsil Ettiğimiz Dünya Lideri Markalar
          </h1>
          <p className="text-slate-600 text-base font-light">
            Marin vinçleri, mobil boat hoist ve ağır sanayi taşımacılığında küresel çapta en güvenilir üreticilerin Türkiye yetkili temsilcisiyiz.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Markalar yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-16 flex items-center">
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt={brand.name} className="h-12 w-auto max-w-[180px] object-contain" />
                    ) : (
                      <span className="text-2xl font-black text-blue-900 font-heading tracking-wider border-b-2 border-blue-600 pb-1">
                        {brand.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {getField(brand, 'description')}
                  </p>
                </div>

                <Link
                  to={`/urunler?brand=${brand.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors group"
                >
                  <span>Marka Ürünlerini İncele</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
