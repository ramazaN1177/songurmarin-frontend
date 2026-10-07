import React, { useState } from 'react';
import { Eye, Play, X, Sparkles, MessageSquare } from 'lucide-react';
import type { GalleryItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface GalleryCardProps {
  item: GalleryItem;
  onOpenMedia: (item: GalleryItem) => void;
  aspectRatio?: 'square' | 'video' | '4/3';
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ 
  item, 
  onOpenMedia,
  aspectRatio = '4/3' 
}) => {
  const { getField } = useLanguage();
  const [showDescription, setShowDescription] = useState(false);

  const title = getField(item, 'title') || '';
  const description = getField(item, 'description') || title;
  const imageSrc = item.thumbnailUrl || item.mediaUrl || item.imageUrl || '';

  const aspectClass = 
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'video' ? 'aspect-video' : 'aspect-[4/3]';

  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDescription(!showDescription);
  };

  return (
    <div 
      className={`group relative ${aspectClass} bg-slate-950 rounded-2xl overflow-hidden border border-slate-200/80 hover:border-sky-500 shadow-md hover:shadow-2xl transition-all duration-500`}
    >
      {/* Background Image (Net, Asla Blurlanmaz) */}
      <img
        src={imageSrc}
        alt={title || 'Gallery item'}
        onClick={() => onOpenMedia(item)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
      />

      {/* Type Badge (Top Left) */}
      <div className="absolute top-3 left-3 z-10 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-sky-400 border border-sky-500/30 uppercase tracking-wider shadow-sm pointer-events-none">
        {item.type === 'VIDEO' ? 'Video' : 'Fotoğraf'}
      </div>

      {/* Category Badge (Top Right) */}
      {item.category && (
        <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-900 border border-slate-200 uppercase tracking-wider shadow-sm pointer-events-none">
          {item.category}
        </div>
      )}

      {/* Alt Bar: Sol tarafta İncele/Oynat ikonu, Sağ tarafta Açıklamayı Oku Butonu */}
      <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        {/* Sol Aksiyon Butonu */}
        <button
          type="button"
          onClick={() => onOpenMedia(item)}
          className="pointer-events-auto px-3 py-1.5 rounded-xl bg-slate-950/75 hover:bg-slate-950 text-white text-[11px] font-bold backdrop-blur-md border border-white/20 shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
        >
          {item.type === 'VIDEO' ? (
            <>
              <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
              <span>İzle</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Büyüt</span>
            </>
          )}
        </button>

        {/* Sağ Alt Köşedeki Açıklamayı Oku / Kapat Butonu */}
        <button
          type="button"
          onClick={toggleDescription}
          aria-label={showDescription ? 'Açıklamayı Gizle' : 'Açıklamayı Oku'}
          className={`pointer-events-auto px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center gap-1.5 ${
            showDescription
              ? 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400/50'
              : 'bg-sky-500 hover:bg-sky-400 text-slate-950 border border-sky-300 shadow-sky-500/25 hover:scale-105 active:scale-95'
          }`}
        >
          {showDescription ? (
            <>
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Kapat</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>Açıklamayı Oku</span>
            </>
          )}
        </button>
      </div>

      {/* SAĞ ALT KÖŞEDE AÇILAN ŞIK VE ZARİF AÇIKLAMA KARTİ (Görseli Blurlamaz, Hafif Opasiteli Şık Zemin) */}
      {showDescription && (
        <div 
          className="absolute right-3 bottom-14 left-3 sm:left-auto sm:max-w-xs z-20 bg-slate-950/90 border border-sky-400/40 rounded-2xl p-4 shadow-2xl text-white backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Başlık Satırı */}
          <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-1.5">
            <div className="flex items-center gap-1.5 text-sky-400 text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{title || 'Proje Detayı'}</span>
            </div>
            <button
              onClick={toggleDescription}
              className="text-slate-400 hover:text-white p-0.5 transition-colors"
              title="Kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Açıklama Metni — Yatık / İtalik Şık Tipografi */}
          <p className="text-xs sm:text-[13px] italic font-serif text-slate-100 leading-relaxed drop-shadow-sm font-medium">
            "{description}"
          </p>
        </div>
      )}
    </div>
  );
};
