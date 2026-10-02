import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Edit3, Trash2, Save } from 'lucide-react';
import { apiService } from '../../api/client';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Modal } from '../../components/common/Modal';
import type { Brand } from '../../types';

export const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Partial<Brand> | null>(null);
  const [saving, setSaving] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminBrands();
      setBrands(data);
    } catch (err) {
      console.error('Brands load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingBrand({
      name: '',
      descriptionTr: '',
      descriptionEn: '',
      logoUrl: '',
      orderIndex: brands.length + 1,
      isActive: true
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: Brand) => {
    setEditingBrand({ ...brand });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu markayı silmek istediğinize emin misiniz?')) return;
    const target = brands.find(b => b.id === id);
    if (target?.logoUrl) {
      await apiService.deleteFile(target.logoUrl);
    }
    try {
      await apiService.deleteBrand(id);
      setBrands(brands.filter(b => b.id !== id));
    } catch {
      setBrands(brands.filter(b => b.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editingBrand.name) return;

    setSaving(true);
    try {
      let finalLogoUrl = editingBrand.logoUrl || null;
      const originalBrand = brands.find(b => b.id === editingBrand.id);

      if (selectedFile) {
        const uploadRes = await apiService.uploadFile(selectedFile);
        finalLogoUrl = uploadRes.url;
        if (originalBrand?.logoUrl && originalBrand.logoUrl !== finalLogoUrl) {
          await apiService.deleteFile(originalBrand.logoUrl);
        }
      } else if (editingBrand.id && !editingBrand.logoUrl && originalBrand?.logoUrl) {
        await apiService.deleteFile(originalBrand.logoUrl);
      }

      const payload = {
        ...editingBrand,
        logoUrl: finalLogoUrl
      };

      if (editingBrand.id) {
        const updated = await apiService.updateBrand(editingBrand.id, payload);
        setBrands(brands.map(b => b.id === updated.id ? updated : b));
      } else {
        const created = await apiService.createBrand(payload);
        setBrands([...brands, created]);
      }
      await loadBrands();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Brand save error:', err);
      alert('Marka bilgileri sunucuya kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">Marka Yönetimi</h1>
          <p className="text-xs text-slate-500 mt-0.5">Temsil edilen üretici ve distribütörlük markalarını yönetin</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Marka Ekle</span>
        </button>
      </div>

      {/* Brands Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:border-blue-500 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="font-extrabold text-base text-slate-900 font-heading">{brand.name}</span>
                  </div>
                  {brand.isActive ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Pasif
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {brand.descriptionTr || 'Açıklama girilmedi.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(brand)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                    title="Düzenle"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
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
      {editingBrand && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingBrand.id ? 'Markayı Düzenle' : 'Yeni Marka Ekle'}
          subtitle="Temsil edilen üretici ve distribütörlük markası bilgilerini düzenleyin"
          icon={<ShieldCheck className="w-5 h-5 text-blue-400" />}
          maxWidth="lg"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">Marka Adı*</label>
              <input
                type="text"
                value={editingBrand.name || ''}
                onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                required
                placeholder="Örn: Cimolai Technology"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <ImageUploader
                label="Marka Logosu"
                value={editingBrand.logoUrl || ''}
                onFileSelect={(file) => setSelectedFile(file)}
                onChange={(url) => setEditingBrand({ ...editingBrand, logoUrl: url })}
                helperText="Marka logosunu bilgisayarınızdan seçip yükleyin (PNG, SVG, JPG)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Açıklama (TR)</label>
                <textarea
                  rows={3}
                  value={editingBrand.descriptionTr || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, descriptionTr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Description (EN)</label>
                <textarea
                  rows={3}
                  value={editingBrand.descriptionEn || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, descriptionEn: e.target.value })}
                  placeholder="Brand description in English"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={Boolean(editingBrand.isActive)}
                  onChange={(e) => setEditingBrand({ ...editingBrand, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Aktif Marka</span>
              </label>
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
