import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, Play } from 'lucide-react';
import { apiService } from '../../api/client';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Modal } from '../../components/common/Modal';
import type { GalleryItem } from '../../types';

export const AdminGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminGallery();
      setItems(data);
    } catch (err) {
      console.error('Gallery load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem({
      titleTr: '',
      titleEn: '',
      descriptionTr: '',
      descriptionEn: '',
      type: 'IMAGE',
      category: 'Marina & Liman',
      mediaUrl: '',
      thumbnailUrl: null,
      orderIndex: items.length + 1,
      isActive: true,
      isPublished: true,
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem({ ...item });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu galeri görselini silmek istediğinize emin misiniz?')) return;
    try {
      await apiService.deleteGalleryItem(id);
      setItems(prev => prev.filter(i => Number(i.id) !== Number(id)));
      await loadGallery();
    } catch (err) {
      console.error('Gallery delete error:', err);
      alert('Silme işlemi tamamlanamadı. Lütfen tekrar deneyin.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSaving(true);

    try {
      let finalMediaUrl = editingItem.mediaUrl || '';

      if (selectedFile) {
        const uploadRes = await apiService.uploadFile(selectedFile);
        finalMediaUrl = uploadRes.url;
      }

      if (!finalMediaUrl) {
        alert('Lütfen bir görsel seçin veya yükleyin.');
        setSaving(false);
        return;
      }

      const payload = {
        ...editingItem,
        mediaUrl: finalMediaUrl,
        imageUrl: finalMediaUrl,
        isPublished: true,
        isActive: true,
      };

      if (editingItem.id) {
        const updated = await apiService.updateGalleryItem(editingItem.id, payload);
        setItems(prev => prev.map(i => Number(i.id) === Number(updated.id) ? updated : i));
      } else {
        const created = await apiService.createGalleryItem(payload);
        setItems(prev => [created, ...prev]);
      }

      setIsModalOpen(false);
      setEditingItem(null);
      setSelectedFile(null);
      await loadGallery();
    } catch (err) {
      console.error('Gallery save error:', err);
      alert('Galeri medyası sunucuya kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">Galeri Yönetimi</h1>
          <p className="text-xs text-slate-500 mt-0.5">Saha ve proje fotoğraf/video galerisini yönetin</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Medya Ekle</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
          Henüz galeri görseli bulunmuyor. Yeni medya ekleyebilirsiniz.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-500 transition-all group"
            >
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                <img
                  src={item.thumbnailUrl || item.mediaUrl || item.imageUrl || '/src/assets/hero/hero-slide-1.jpg'}
                  alt={item.titleTr || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {item.category || 'Genel'}
                </div>
                {item.type === 'VIDEO' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                    <Play className="w-8 h-8 text-white fill-current" />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-1">
                <span className="text-xs font-bold text-slate-900 block line-clamp-1">{item.titleTr || 'Başlıksız Medya'}</span>
              </div>

              <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{item.type || 'IMAGE'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                    title="Düzenle"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {editingItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem.id ? 'Galeri Medyasını Düzenle' : 'Yeni Galeri Medyası Ekle'}
          subtitle="Fotoğraf veya video medyasını galeri koleksiyonuna ekleyin"
          icon={<Plus className="w-5 h-5 text-blue-400" />}
          maxWidth="lg"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Medya Başlığı (TR)</label>
                <input
                  type="text"
                  value={editingItem.titleTr || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, titleTr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Media Title (EN)</label>
                <input
                  type="text"
                  value={editingItem.titleEn || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, titleEn: e.target.value })}
                  placeholder="e.g. Boat Hoist Operation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Kısa Açıklama (TR - Yatık Gösterilecek)</label>
                <textarea
                  rows={2}
                  value={editingItem.descriptionTr || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, descriptionTr: e.target.value })}
                  placeholder="Fotoğrafın altında tıklanınca çıkacak açıklama..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Short Description (EN)</label>
                <textarea
                  rows={2}
                  value={editingItem.descriptionEn || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, descriptionEn: e.target.value })}
                  placeholder="Short description to appear in italics..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Medya Tipi</label>
                <select
                  value={editingItem.type || 'IMAGE'}
                  onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as 'IMAGE' | 'VIDEO' })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="IMAGE">Fotoğraf (Image)</option>
                  <option value="VIDEO">Video</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Kategori</label>
                <select
                  value={editingItem.category || 'Marina & Liman'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="Marina & Liman">Marina & Liman</option>
                  <option value="Tersane & İmalat">Tersane & İmalat</option>
                  <option value="Servis & Bakım">Servis & Bakım</option>
                </select>
              </div>
            </div>

            <div>
              <ImageUploader
                label="Galeri Medyası / Görseli"
                value={editingItem.mediaUrl || editingItem.imageUrl || ''}
                onFileSelect={(file) => setSelectedFile(file)}
                onChange={(url) => setEditingItem({ ...editingItem, mediaUrl: url, imageUrl: url })}
                helperText="Galeri için bilgisayarınızdan görsel seçin veya yükleyin"
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
