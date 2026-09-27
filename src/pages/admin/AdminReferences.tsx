import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit3, Trash2, Save } from 'lucide-react';
import { apiService } from '../../api/client';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Modal } from '../../components/common/Modal';
import type { Reference } from '../../types';

export const AdminReferences: React.FC = () => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<Partial<Reference> | null>(null);
  const [saving, setSaving] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    setLoading(true);
    const data = await apiService.getReferences();
    setReferences(data);
    setLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingRef({
      clientName: '',
      titleTr: '',
      descriptionTr: '',
      logoUrl: '',
      projectYear: 2024,
      orderIndex: references.length + 1,
      isActive: true
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ref: Reference) => {
    setEditingRef({ ...ref });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu referansı silmek istediğinize emin misiniz?')) return;
    const target = references.find(r => r.id === id);
    if (target?.logoUrl) {
      await apiService.deleteFile(target.logoUrl);
    }
    try {
      await apiService.deleteReference(id);
      setReferences(references.filter(r => r.id !== id));
    } catch {
      setReferences(references.filter(r => r.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRef || !editingRef.clientName) return;

    setSaving(true);
    try {
      let finalLogoUrl = editingRef.logoUrl || null;
      const originalRef = references.find(r => r.id === editingRef.id);

      // If user selected a new file, upload to SeaweedFS now on save
      if (selectedFile) {
        const uploadRes = await apiService.uploadFile(selectedFile);
        finalLogoUrl = uploadRes.url;
        if (originalRef?.logoUrl && originalRef.logoUrl !== finalLogoUrl) {
          await apiService.deleteFile(originalRef.logoUrl);
        }
      } else if (editingRef.id && !editingRef.logoUrl && originalRef?.logoUrl) {
        await apiService.deleteFile(originalRef.logoUrl);
      }

      const payload = {
        ...editingRef,
        logoUrl: finalLogoUrl
      };

      if (editingRef.id) {
        const updated = await apiService.updateReference(editingRef.id, payload);
        setReferences(references.map(r => r.id === updated.id ? updated : r));
      } else {
        const created = await apiService.createReference(payload);
        setReferences([...references, created]);
      }
      await loadReferences();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Reference save error:', err);
      alert('Referans bilgileri sunucuya kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">Referans Yönetimi</h1>
          <p className="text-xs text-slate-500 mt-0.5">Teslimat yapılan marina, tersane ve kurum referanslarını yönetin</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Referans Ekle</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {references.map((ref) => (
            <div
              key={ref.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-500 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span className="font-extrabold text-base text-slate-900 font-heading">{ref.clientName}</span>
                  </div>
                  {ref.projectYear && (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {ref.projectYear}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{ref.titleTr || ref.descriptionTr}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditModal(ref)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                  title="Düzenle"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ref.id)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editingRef && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingRef.id ? 'Referansı Düzenle' : 'Yeni Referans Ekle'}
          subtitle="Tamamlanan proje ve referans müşteri verisini ekleyin"
          icon={<Award className="w-5 h-5 text-blue-400" />}
          maxWidth="lg"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Müşteri / Kurum Adı*</label>
              <input
                type="text"
                value={editingRef.clientName || ''}
                onChange={(e) => setEditingRef({ ...editingRef, clientName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Proje / Teslimat Başlığı (TR)</label>
                <input
                  type="text"
                  value={editingRef.titleTr || ''}
                  onChange={(e) => setEditingRef({ ...editingRef, titleTr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Project Title (EN)</label>
                <input
                  type="text"
                  value={editingRef.titleEn || ''}
                  onChange={(e) => setEditingRef({ ...editingRef, titleEn: e.target.value })}
                  placeholder="e.g. Marina Boat Hoist Delivery"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Açıklama (TR)</label>
                <textarea
                  rows={2}
                  value={editingRef.descriptionTr || ''}
                  onChange={(e) => setEditingRef({ ...editingRef, descriptionTr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Description (EN)</label>
                <textarea
                  rows={2}
                  value={editingRef.descriptionEn || ''}
                  onChange={(e) => setEditingRef({ ...editingRef, descriptionEn: e.target.value })}
                  placeholder="Project details in English"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <ImageUploader
                label="Referans / Müşteri Logosu"
                value={editingRef.logoUrl || ''}
                onFileSelect={(file) => setSelectedFile(file)}
                onChange={(url) => setEditingRef({ ...editingRef, logoUrl: url })}
                helperText="Referans firma logosunu bilgisayarınızdan yükleyin"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Proje Yılı</label>
              <input
                type="number"
                value={editingRef.projectYear || 2024}
                onChange={(e) => setEditingRef({ ...editingRef, projectYear: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center gap-2 shadow-md transition-all"
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
