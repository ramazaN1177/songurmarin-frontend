import React from 'react';
import { X } from 'lucide-react';
import type { GalleryItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  const { getField } = useLanguage();

  if (!item) return null;

  const title = getField(item, 'title');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full bg-[#0A192F] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#0F2C59] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 uppercase">
              {item.type === 'VIDEO' ? 'Video' : 'Fotoğraf'}
            </span>
            <h4 className="text-white font-semibold text-sm sm:text-base font-heading">{title}</h4>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Container */}
        <div className="relative bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[75vh]">
          {item.type === 'VIDEO' ? (
            <div className="w-full aspect-video">
              <iframe
                src={item.mediaUrl}
                title={title || 'Video'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <img
              src={item.mediaUrl}
              alt={title || 'Gallery item'}
              className="max-h-[70vh] w-auto max-w-full object-contain mx-auto"
            />
          )}
        </div>

        {/* Footer info */}
        {(title || item.descriptionTr || item.descriptionEn) && (
          <div className="p-4 sm:p-5 bg-[#0A192F] text-center border-t border-slate-800 space-y-1.5">
            {title && <h5 className="text-sm font-bold text-white">{title}</h5>}
            {(getField(item, 'description') || item.descriptionTr || item.descriptionEn) && (
              <p className="text-xs sm:text-sm text-sky-200 italic font-serif max-w-2xl mx-auto leading-relaxed">
                "{getField(item, 'description') || item.descriptionTr || item.descriptionEn}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
