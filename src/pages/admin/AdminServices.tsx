import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Edit3, Trash2, Save } from 'lucide-react';
import { apiService } from '../../api/client';
import { RichContentEditor } from '../../components/admin/RichContentEditor';
import { Modal } from '../../components/common/Modal';
import type { Service } from '../../types';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    const data = await apiService.getServices();
    setServices(data);
    setLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingService({
      titleTr: '',
      titleEn: '',
      summaryTr: '',
      summaryEn: '',
      contentTr: '',
      contentEn: '',
      slug: '',
      orderIndex: services.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    try {
      await apiService.deleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.titleTr) return;

    setSaving(true);
    try {
      if (editingService.id) {
        const updated = await apiService.updateService(editingService.id, editingService);
        setServices(services.map(s => s.id === updated.id ? updated : s));
      } else {
        const created = await apiService.createService(editingService);
        setServices([...services, created]);
      }
      await loadServices();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Service save error:', err);
      alert('Hizmet bilgileri sunucuya kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">Hizmet Yönetimi</h1>
          <p className="text-xs text-slate-500 mt-0.5">Teknik servis ve mühendislik hizmetlerini düzenleyin</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Hizmet Ekle</span>
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((serv) => (
            <div
              key={serv.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:border-blue-500 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-base text-slate-900 font-heading">{serv.titleTr}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {serv.summaryTr}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">/{serv.slug}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(serv)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(serv.id)}
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

      {/* Add / Edit Modal */}
      {editingService && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingService.id ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
          subtitle="Sunulan mühendislik ve teknik hizmet detaylarını güncelleyin"
          icon={<Wrench className="w-5 h-5 text-blue-400" />}
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Hizmet Adı (TR)*</label>
                <input
                  type="text"
                  value={editingService.titleTr || ''}
                  onChange={(e) => setEditingService({ ...editingService, titleTr: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Service Title (EN)</label>
                <input
                  type="text"
                  value={editingService.titleEn || ''}
                  onChange={(e) => setEditingService({ ...editingService, titleEn: e.target.value })}
                  placeholder="e.g. Marine Crane Maintenance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Özet Açıklama (TR)</label>
                <textarea
                  rows={2}
                  value={editingService.summaryTr || ''}
                  onChange={(e) => setEditingService({ ...editingService, summaryTr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Summary Description (EN)</label>
                <textarea
                  rows={2}
                  value={editingService.summaryEn || ''}
                  onChange={(e) => setEditingService({ ...editingService, summaryEn: e.target.value })}
                  placeholder="Short service summary in English"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <RichContentEditor
                label="Detaylı Hizmet İçeriği (TR & EN)"
                valueTr={editingService.contentTr || ''}
                valueEn={editingService.contentEn || ''}
                onChangeTr={(html) => setEditingService((prev) => prev ? { ...prev, contentTr: html } : null)}
                onChangeEn={(html) => setEditingService((prev) => prev ? { ...prev, contentEn: html } : null)}
                helperText="Hizmet detayları ve teknik kapsamı Türkçe ve İngilizce sekmelerinden doldurun."
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
