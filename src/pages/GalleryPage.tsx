import React, { useEffect, useState } from 'react';
import { Camera, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/client';
import type { GalleryItem } from '../types';
import { LightboxModal } from '../components/LightboxModal';
import { GalleryCard } from '../components/GalleryCard';

export const GalleryPage: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeType, setActiveType] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      const data = await apiService.getGallery();
      setItems(data);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const categories = ['ALL', ...Array.from(new Set(items.map(i => i.category)))];

  const filteredItems = items.filter(item => {
    if (activeType !== 'ALL' && item.type !== activeType) return false;
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    return true;
  });

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Camera className="w-4 h-4 text-blue-700" />
            <span>{t('navGallery')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
            {t('galleryPageTitle')}
          </h1>
          <p className="text-slate-600 text-base font-light">
            {t('galleryPageSub')}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveType('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeType === 'ALL'
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:text-blue-700'
              }`}
            >
              {t('filterAll')}
            </button>
            <button
              onClick={() => setActiveType('IMAGE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeType === 'IMAGE'
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:text-blue-700'
              }`}
            >
              {t('filterImages')}
            </button>
            <button
              onClick={() => setActiveType('VIDEO')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeType === 'VIDEO'
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:text-blue-700'
              }`}
            >
              {t('filterVideos')}
            </button>
          </div>

          {/* Category Dropdown/Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full">
            <Filter className="w-4 h-4 text-blue-700 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'Tüm Kategoriler' : cat}
              </button>
            ))}
          </div>

        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Galeri yükleniyor...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((gItem) => (
              <GalleryCard
                key={gItem.id}
                item={gItem}
                onOpenMedia={(item) => setSelectedMedia(item)}
                aspectRatio="4/3"
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            Seçilen filtreye uygun içerik bulunamadı.
          </div>
        )}

      </div>

      <LightboxModal item={selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  );
};
