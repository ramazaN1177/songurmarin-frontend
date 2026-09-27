import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save } from 'lucide-react';
import { apiService } from '../../api/client';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Modal } from '../../components/common/Modal';
import type { HeroSlide } from '../../types';

export const AdminHeroSlides: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [saving, setSaving] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setLoading(true);
    const data = await apiService.getHeroSlides();
    setSlides(data);
    setLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingSlide({
      titleTr: '',
      titleEn: '',
      subtitleTr: '',
      subtitleEn: '',
      imageUrl: '',
      buttonTextTr: 'Ürünlerimizi Keşfedin',
      buttonUrl: '/urunler',
      orderIndex: slides.length + 1,
      isActive: true
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: HeroSlide) => {
    setEditingSlide({ ...slide });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu manşet slaytını silmek istediğinize emin misiniz?')) return;
    const target = slides.find(s => s.id === id);
    if (target?.imageUrl) {
      await apiService.deleteFile(target.imageUrl);
    }
    try {
      await apiService.deleteHeroSlide(id);
      setSlides(slides.filter(s => s.id !== id));
    } catch {
      setSlides(slides.filter(s => s.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.titleTr) return;

    setSaving(true);
    try {
      let finalImageUrl = editingSlide.imageUrl || null;
      const originalSlide = slides.find(s => s.id === editingSlide.id);

      if (selectedFile) {
        const uploadRes = await apiService.uploadFile(selectedFile);
        finalImageUrl = uploadRes.url;
        if (originalSlide?.imageUrl && originalSlide.imageUrl !== finalImageUrl) {
          await apiService.deleteFile(originalSlide.imageUrl);
        }
      } else if (editingSlide.id && !editingSlide.imageUrl && originalSlide?.imageUrl) {
        await apiService.deleteFile(originalSlide.imageUrl);
      }

      const payload = {
        ...editingSlide,
        imageUrl: finalImageUrl || ''
      };

      if (editingSlide.id) {
        const updated = await apiService.updateHeroSlide(editingSlide.id, payload);
        setSlides(slides.map(s => s.id === updated.id ? updated : s));
      } else {
        const created = await apiService.createHeroSlide(payload);
        setSlides([...slides, created]);
      }
      await loadSlides();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Slide save error:', err);
      alert('Slayt bilgileri sunucuya kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">Hero Slider Yönetimi</h1>
          <p className="text-xs text-slate-500 mt-0.5">Ana sayfa üst slider manşetlerini yönetin</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Slayt Ekle</span>
        </button>
      </div>

      {/* Slides Cards List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-500 transition-all"
            >
              <div className="aspect-[16/9] bg-slate-950 relative overflow-hidden">
                <img
                  src={slide.imageUrl}
                  alt={slide.titleTr || ''}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20">
                  Slayt #{index + 1}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 font-heading line-clamp-1">{slide.titleTr}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{slide.subtitleTr}</p>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-blue-600">Buton: {slide.buttonTextTr || 'Detay'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(slide)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      {editingSlide && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingSlide.id ? 'Slaytı Düzenle' : 'Yeni Slayt Ekle'}
          subtitle="Ana sayfa manşet slayt görseli ve metinlerini güncelleyin"
          icon={<Plus className="w-5 h-5 text-blue-400" />}
          maxWidth="lg"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Slayt Başlığı (TR)*</label>
                <input
                  type="text"
                  value={editingSlide.titleTr || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, titleTr: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Slide Title (EN)</label>
                <input
                  type="text"
                  value={editingSlide.titleEn || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, titleEn: e.target.value })}
                  placeholder="e.g. World-Class Marine Hoists"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Alt Açıklama (TR)</label>
                <textarea
                  rows={2}
                  value={editingSlide.subtitleTr || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitleTr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Subtitle (EN)</label>
                <textarea
                  rows={2}
                  value={editingSlide.subtitleEn || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitleEn: e.target.value })}
                  placeholder="Slide subtitle in English"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Buton Metni (TR)</label>
                <input
                  type="text"
                  value={editingSlide.buttonTextTr || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, buttonTextTr: e.target.value })}
                  placeholder="Örn: Ürünlerimizi Keşfedin"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Button Text (EN)</label>
                <input
                  type="text"
                  value={editingSlide.buttonTextEn || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, buttonTextEn: e.target.value })}
                  placeholder="e.g. Discover Our Products"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
                />
              </div>
            </div>

            <div>
              <ImageUploader
                label="Slayt Görseli"
                value={editingSlide.imageUrl || ''}
                onFileSelect={(file) => setSelectedFile(file)}
                onChange={(url) => setEditingSlide({ ...editingSlide, imageUrl: url })}
                helperText="Ana sayfa manşeti için yüksek çözünürlüklü yatay görsel yükleyin"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
