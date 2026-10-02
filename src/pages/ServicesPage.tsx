import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/client';
import type { Service } from '../types';

export const ServicesPage: React.FC = () => {
  const { t, getField } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const data = await apiService.getServices();
      setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-4 h-4 text-blue-700" />
            <span>{t('navServices')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
            {t('servicesPageTitle')}
          </h1>
          <p className="text-slate-600 text-base font-light">
            {t('servicesPageSub')}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>{t('loadingServices')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((serv) => (
              <div
                key={serv.id}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">{getField(serv, 'title')}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{getField(serv, 'summary')}</p>
                </div>

                <Link
                  to={`/hizmetler/${serv.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors group"
                >
                  <span>{t('viewServiceDetails')}</span>
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
