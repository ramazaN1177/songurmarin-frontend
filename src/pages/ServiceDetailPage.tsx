import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wrench, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/client';
import type { Service } from '../types';

interface ServiceDetailPageProps {
  onOpenQuoteModal: (productOrService?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ onOpenQuoteModal }) => {
  const { slug } = useParams<{ slug: string }>();
  const { getField } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await apiService.getServiceBySlug(slug);
      setService(data);
      setLoading(false);
    };
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>{t('loadingServices')}</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-32 text-center text-slate-900 space-y-4">
        <h2 className="text-2xl font-bold font-heading">{t('serviceNotFound')}</h2>
        <p className="text-slate-600">{t('serviceNotFoundSub')}</p>
        <Link to="/hizmetler" className="inline-flex items-center gap-2 text-blue-700 font-bold">
          <ArrowLeft className="w-4 h-4" /> {t('backToServices')}
        </Link>
      </div>
    );
  }

  const title = getField(service, 'title');
  const summary = getField(service, 'summary');
  const content = getField(service, 'content');

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <Link to="/hizmetler" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToServices')}</span>
        </Link>

        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-4 h-4 text-blue-700" />
            <span>{t('serviceBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">{title}</h1>
          {summary && <p className="text-lg text-slate-600 font-light leading-relaxed">{summary}</p>}
        </div>

        {service.imageUrl && (
          <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
            <img src={service.imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-slate-700 text-base leading-relaxed space-y-6">
          <div dangerouslySetInnerHTML={{ __html: content || '' }} />
        </div>

        <div className="pt-4">
          <button
            onClick={() => onOpenQuoteModal(title)}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 text-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{t('serviceQuoteBtn')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
