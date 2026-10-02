import React, { useState, useEffect } from 'react';
import { AlignLeft, Globe } from 'lucide-react';

interface RichContentEditorProps {
  value?: string;
  onChange?: (htmlContent: string) => void;
  valueTr?: string;
  valueEn?: string;
  onChangeTr?: (htmlContent: string) => void;
  onChangeEn?: (htmlContent: string) => void;
  label?: string;
  helperText?: string;
  className?: string;
}

const parseHtmlToText = (html: string | undefined): string => {
  if (!html) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const paragraphs = Array.from(tempDiv.querySelectorAll('p'))
    .map(p => p.textContent?.trim() || '')
    .filter(Boolean);

  const bulletPoints = Array.from(tempDiv.querySelectorAll('li'))
    .map(li => {
      const spans = li.querySelectorAll('span');
      if (spans.length >= 2) {
        return spans[1].textContent?.trim() || li.textContent?.trim() || '';
      }
      return li.textContent?.trim() || '';
    })
    .filter(Boolean);

  if (paragraphs.length > 0 || bulletPoints.length > 0) {
    const parts: string[] = [];
    if (paragraphs.length > 0) {
      parts.push(paragraphs.join('\n\n'));
    }
    if (bulletPoints.length > 0) {
      parts.push(bulletPoints.map(b => `• ${b}`).join('\n'));
    }
    return parts.join('\n\n');
  }

  return tempDiv.textContent?.trim() || '';
};

const buildHtmlFromText = (text: string): string => {
  if (!text || !text.trim()) return '';

  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  let html = '';

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const isBulletList = lines.length > 0 && lines.every(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'));

    if (isBulletList) {
      html += `<ul className="space-y-2.5 my-4 pl-2">\n`;
      lines.forEach(l => {
        const clean = l.replace(/^[•\-*]\s*/, '');
        html += `  <li className="flex items-start gap-2.5 text-slate-700 text-sm sm:text-base"><span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></span><span>${clean}</span></li>\n`;
      });
      html += `</ul>\n`;
    } else {
      const pText = lines.join(' ');
      html += `<p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">${pText}</p>\n`;
    }
  }

  return html.trim();
};

export const RichContentEditor: React.FC<RichContentEditorProps> = ({
  value,
  onChange,
  valueTr,
  valueEn,
  onChangeTr,
  onChangeEn,
  label = 'Detaylı İçerik & Açıklama',
  helperText = 'Ürün detaylarını, açıklamalarını ve teknik verilerini Türkçe ve İngilizce olarak girin.',
  className = '',
}) => {
  const [activeLang, setActiveLang] = useState<'tr' | 'en'>('tr');

  const [textTr, setTextTr] = useState<string>(() => parseHtmlToText(valueTr || value));
  const [textEn, setTextEn] = useState<string>(() => parseHtmlToText(valueEn));

  useEffect(() => {
    if (valueTr !== undefined || value !== undefined) {
      setTextTr(parseHtmlToText(valueTr || value));
    }
  }, [valueTr, value]);

  useEffect(() => {
    if (valueEn !== undefined) {
      setTextEn(parseHtmlToText(valueEn));
    }
  }, [valueEn]);

  const handleTextChange = (newText: string) => {
    if (activeLang === 'tr') {
      setTextTr(newText);
      const html = buildHtmlFromText(newText);
      if (onChangeTr) onChangeTr(html);
      if (onChange) onChange(html);
    } else {
      setTextEn(newText);
      const html = buildHtmlFromText(newText);
      if (onChangeEn) onChangeEn(html);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header & Language Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <label className="block text-xs font-bold text-slate-900">
            {label}
          </label>
          {helperText && (
            <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
          )}
        </div>

        {/* TR / EN Language Toggle Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveLang('tr')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeLang === 'tr'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇹🇷 Türkçe (TR)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeLang === 'en'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇬🇧 English (EN)</span>
          </button>
        </div>
      </div>

      {/* Clean Textarea Input */}
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-2 text-xs">
        <label className="font-bold text-slate-800 flex items-center gap-1.5">
          <AlignLeft className="w-4 h-4 text-blue-600" />
          {activeLang === 'tr' ? 'Detaylı Açıklama Metni (TR)' : 'Detailed Description Text (EN)'}
        </label>
        <textarea
          rows={7}
          value={activeLang === 'tr' ? textTr : textEn}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={
            activeLang === 'tr'
              ? 'Detaylı ürün veya hizmet açıklamasını buraya yazın...\n\nParagraflar arasında boşluk bırakabilirsiniz.\nMaddeli liste yapmak isterseniz satır başına • veya - koyabilirsiniz.'
              : 'Enter detailed description here...\n\nLeave blank line between paragraphs.\nYou can use - or • at the beginning of lines for bullet lists.'
          }
          className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed text-xs font-normal shadow-2xs"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>İpucu: Paragraflar veya maddeler halinde dilediğiniz gibi yazabilirsiniz.</span>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" />
            {activeLang === 'tr' ? 'Türkçe İçerik Düzenleniyor' : 'English Content Editing'}
          </span>
        </div>
      </div>
    </div>
  );
};
