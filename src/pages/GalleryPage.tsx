import React, { useEffect, useState } from 'react';
import { Camera, Play, Eye, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/client';
import type { GalleryItem } from '../types';
import { LightboxModal } from '../components/LightboxModal';

export const GalleryPage: React.FC = () => {
  const { t, getField } = useLanguage();
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
              <div
                key={gItem.id}
                onClick={() => setSelectedMedia(gItem)}
                className="group relative aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:shadow-xl hover:border-blue-500 transition-all"
              >
                <img
                  src={gItem.thumbnailUrl || gItem.mediaUrl}
                  alt={getField(gItem, 'title') || 'Gallery Item'}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                {/* Type Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-700 border border-slate-200 uppercase shadow-sm">
                  {gItem.type === 'VIDEO' ? 'Video' : 'Fotoğraf'}
                </div>

                {/* Hover Overlay */}
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
