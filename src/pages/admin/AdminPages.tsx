import React, { useState, useEffect } from 'react';
import { Edit3, Save, FileText, ShieldCheck, Layers, CheckCircle2, Sparkles } from 'lucide-react';
import { apiService } from '../../api/client';
import { RichContentEditor } from '../../components/admin/RichContentEditor';
import { ImageUploader } from '../../components/admin/ImageUploader';
import type { Page } from '../../types';

export const AdminPages: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editingContentTr, setEditingContentTr] = useState('');
  const [editingContentEn, setEditingContentEn] = useState('');
  const [editingSummaryTr, setEditingSummaryTr] = useState('');
  const [editingSummaryEn, setEditingSummaryEn] = useState('');
  const [editingImage, setEditingImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    const slugs = ['hakkimizda', 'misyon-vizyon', 'kvkk'];
    const loadedPages: Page[] = [];
    for (const slug of slugs) {
      const p = await apiService.getPageBySlug(slug);
      if (p) loadedPages.push(p);
    }
    setPages(loadedPages);
    if (loadedPages.length > 0) {
      handleSelectPage(loadedPages[0]);
    }
    setLoading(false);
  };

  const handleSelectPage = (page: Page) => {
    setSelectedPage(page);
    setEditingContentTr(page.contentTr || '');
    setEditingContentEn(page.contentEn || '');
    setEditingSummaryTr(page.summaryTr || '');
    setEditingSummaryEn(page.summaryEn || '');
    setEditingImage(page.imageUrl || '');
    setSelectedFile(null);
    setSavedMessage(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;

    setSaving(true);
    setSavedMessage(false);

    try {
      let finalImageUrl = editingImage || null;

      if (selectedFile) {
        const uploadRes = await apiService.uploadFile(selectedFile);
        finalImageUrl = uploadRes.url;
        if (selectedPage.imageUrl && selectedPage.imageUrl !== finalImageUrl) {
          await apiService.deleteFile(selectedPage.imageUrl);
        }
      } else if (!editingImage && selectedPage.imageUrl) {
        await apiService.deleteFile(selectedPage.imageUrl);
      }

      const updated = await apiService.updatePage(selectedPage.id, {
        ...selectedPage,
        contentTr: editingContentTr,
        contentEn: editingContentEn,
        summaryTr: editingSummaryTr,
        summaryEn: editingSummaryEn,
        imageUrl: finalImageUrl || undefined
      });
      setPages(pages.map(p => p.id === updated.id ? updated : p));
      setSelectedPage(updated);
      setSelectedFile(null);
      setSavedMessage(true);
    } catch (err) {
      console.error('Page save error:', err);
      alert('Sayfa içeriği sunucuya kaydedilemedi. Lütfen bağlantınızı kontrol edin.');
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMessage(false), 4000);
    }
  };

  const getPageIcon = (slug: string) => {
    if (slug === 'misyon-vizyon') return <ShieldCheck className="w-5 h-5 text-blue-600" />;
    if (slug === 'kvkk') return <FileText className="w-5 h-5 text-blue-600" />;
    return <Layers className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Bright White & Light Blue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
              Kurumsal Sayfa İçerikleri
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Hakkımızda, Misyon & Vizyon ve KVKK metinlerini görsel form editörü ile kolayca güncelleyin
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>3 Aktif Kurumsal Sayfa</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Sayfa verileri yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Page Selector Sidebar (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
              Düzenlenecek Sayfayı Seçin
            </span>

            <div className="space-y-2.5">
              {pages.map((p) => {
                const isSelected = selectedPage?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPage(p)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                      isSelected
                        ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10'
                        : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl transition-colors ${
                        isSelected ? 'bg-blue-50 text-blue-600' : 'bg-white text-slate-500 border border-slate-200'
                      }`}>
                        {getPageIcon(p.slug)}
                      </div>
                      <div className="space-y-0.5">
                        <span className={`font-bold text-sm block font-heading ${
                          isSelected ? 'text-blue-900' : 'text-slate-800'
                        }`}>
                          {p.titleTr}
                        </span>
                        <span className="text-[11px] block font-mono text-slate-400">
                          /{p.slug}
                        </span>
                      </div>
                    </div>

                    <Edit3 className={`w-4 h-4 transition-transform duration-200 ${
                      isSelected ? 'text-blue-600 translate-x-0' : 'text-slate-300 group-hover:text-slate-500 -translate-x-1 group-hover:translate-x-0'
                    }`} />
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 leading-relaxed space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                💡 İpucu
              </p>
              <p className="text-[11px] text-blue-700">
                Sol taraftan istediğiniz sayfayı seçip form alanlarını doldurduktan sonra "Değişiklikleri Kaydet" butonuna basarak web sitenizde anında canlıya alabilirsiniz.
              </p>
            </div>
          </div>

          {/* Editor Form Panel (Right 8 cols) - Crisp White */}
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            {selectedPage ? (
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Form Subheader */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    {getPageIcon(selectedPage.slug)}
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      "{selectedPage.titleTr}" Sayfasını Düzenle
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl">
                    /{selectedPage.slug}
                  </span>
                </div>

                {savedMessage && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Sayfa içeriği ve görselleri başarıyla kaydedildi!</span>
                  </div>
                )}

                {/* Top Banner Image Upload */}
                <div>
                  <ImageUploader
                    label="Sayfa Kapak Görseli (Opsiyonel)"
                    value={editingImage}
                    onFileSelect={(file) => setSelectedFile(file)}
                    onChange={(url) => setEditingImage(url)}
                    helperText="Sayfanın üst alanında gösterilecek geniş manzara kapak görseli yükleyin"
                  />
                </div>

                {/* Summary Fields Grid TR & EN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block text-xs">
                      Sayfa Özet Açıklaması (TR)
                    </label>
                    <textarea
                      rows={2}
                      value={editingSummaryTr}
                      onChange={(e) => setEditingSummaryTr(e.target.value)}
                      placeholder="Sayfa başlığının hemen altında yer alan kısa özet cümlesi..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block text-xs">
                      Page Summary Description (EN)
                    </label>
                    <textarea
                      rows={2}
                      value={editingSummaryEn}
                      onChange={(e) => setEditingSummaryEn(e.target.value)}
                      placeholder="Page lead summary sentence in English..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
                    />
                  </div>
                </div>

                {/* Dual-Language Rich Content Editor */}
                <div>
                  <RichContentEditor
                    label="Sayfa İçeriği Metin Düzenleyici (TR & EN)"
                    valueTr={editingContentTr}
                    valueEn={editingContentEn}
                    onChangeTr={(html) => setEditingContentTr(html)}
                    onChangeEn={(html) => setEditingContentEn(html)}
                    helperText="Başlık, alt başlık, açıklama metni ve maddelerinizi Türkçe ve İngilizce sekmelerinden kolayca düzenleyin."
                  />
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                  </button>
                </div>

              </form>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">Düzenlenecek sayfayı seçin.</div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
