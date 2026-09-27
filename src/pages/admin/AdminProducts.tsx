import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, CheckCircle, XCircle, X,
  Save, ShieldCheck 
} from 'lucide-react';
import { apiService } from '../../api/client';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { RichContentEditor } from '../../components/admin/RichContentEditor';
import { Modal } from '../../components/common/Modal';
import type { Product, Brand } from '../../types';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);

  // Quick Add Brand State
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [quickBrand, setQuickBrand] = useState({ name: '', descriptionTr: '', descriptionEn: '', logoUrl: '' });
  const [savingQuickBrand, setSavingQuickBrand] = useState(false);

  const handleCreateQuickBrand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickBrand.name.trim()) return;

    setSavingQuickBrand(true);
    try {
      const created = await apiService.createBrand({
        name: quickBrand.name.trim(),
        descriptionTr: quickBrand.descriptionTr.trim() || null,
        descriptionEn: quickBrand.descriptionEn.trim() || null,
        logoUrl: quickBrand.logoUrl || null,
        isActive: true,
        orderIndex: brands.length + 1
      });
      setBrands([...brands, created]);
      if (editingProduct) {
        setEditingProduct({ ...editingProduct, brandId: created.id });
      }
      setIsBrandModalOpen(false);
      setQuickBrand({ name: '', descriptionTr: '', descriptionEn: '', logoUrl: '' });
    } catch (err) {
      console.error('Quick brand create error:', err);
      alert('Marka sunucuda oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setSavingQuickBrand(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [pData, bData] = await Promise.all([
      apiService.getProducts(),
      apiService.getBrands()
    ]);
    setProducts(pData);
    setBrands(bData);
    setLoading(false);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenAddModal = () => {
    setEditingProduct({
      titleTr: '',
      titleEn: '',
      summaryTr: '',
      summaryEn: '',
      contentTr: '',
      contentEn: '',
      brandId: brands[0]?.id || 1,
      slug: '',
      primaryImage: '',
      featured: true,
      isActive: true,
      orderIndex: products.length + 1
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct({ ...prod });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    const target = products.find(p => p.id === id);
    if (target?.primaryImage) {
      await apiService.deleteFile(target.primaryImage);
    }
    try {
      await apiService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.titleTr?.trim() || !editingProduct.titleEn?.trim()) {
      alert('Lütfen ürünün hem Türkçe hem de İngilizce adını doldurunuz.');
      return;
    }

    setSaving(true);
    try {
      let finalPrimaryImage = editingProduct.primaryImage || null;
      const originalProd = products.find(p => p.id === editingProduct.id);

      if (selectedFile) {
        const uploadRes = await apiService.uploadFile(selectedFile);
        finalPrimaryImage = uploadRes.url;
        if (originalProd?.primaryImage && originalProd.primaryImage !== finalPrimaryImage) {
          await apiService.deleteFile(originalProd.primaryImage);
        }
      } else if (editingProduct.id && !editingProduct.primaryImage && originalProd?.primaryImage) {
        await apiService.deleteFile(originalProd.primaryImage);
      }

      // Slug is automatically the hyphenated English title (or Turkish title if English is empty)
      const slugSource = editingProduct.titleEn?.trim() || editingProduct.titleTr?.trim() || 'product';
      const generatedSlug = slugify(slugSource);

      const payload = {
        ...editingProduct,
        slug: generatedSlug,
        primaryImage: finalPrimaryImage
      };

      if (editingProduct.id) {
        const updated = await apiService.updateProduct(editingProduct.id, payload);
        setProducts(products.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await apiService.createProduct(payload);
        setProducts([created, ...products]);
      }
      await loadData();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Product save error:', err);
      alert('Ürün bilgileri sunucuya kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.titleTr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.summaryTr && p.summaryTr.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBrand = selectedBrandFilter === 'ALL' || p.brandId === Number(selectedBrandFilter);
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">Ürün Yönetimi</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Katalogdaki marin vinç ve ekipman ürünlerini düzenleyin veya yenisini ekleyin
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ürün ismi veya açıklama ara..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0">Marka Filtresi:</span>
          <select
            value={selectedBrandFilter}
            onChange={(e) => setSelectedBrandFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">Tüm Markalar</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Yükleniyor...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">Ürün bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">Görsel & Ürün</th>
                  <th className="py-3.5 px-4">Marka</th>
                  <th className="py-3.5 px-4">Öne Çıkan</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map((prod) => {
                  const brand = brands.find(b => b.id === prod.brandId);
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.primaryImage || '/src/assets/hero/hero-slide-1.jpg'}
                            alt={prod.titleTr}
                            className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{prod.titleTr}</span>
                            <span className="text-[10px] text-slate-400 block line-clamp-1">{prod.summaryTr}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          <span>{brand?.name || 'Genel'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {prod.featured ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                            Öne Çıkan
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {prod.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Pasif</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                            title="Düzenle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {editingProduct && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          subtitle="Ürün katalog ve teknik verilerini güncelleyin"
          icon={<ShieldCheck className="w-5 h-5 text-blue-400" />}
          maxWidth="3xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Ürün Adı (TR)*</label>
                <input
                  type="text"
                  value={editingProduct.titleTr || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, titleTr: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Ürün Adı (EN)*</label>
                <input
                  type="text"
                  value={editingProduct.titleEn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, titleEn: e.target.value })}
                  required
                  placeholder="Örn: MBH 800 Mobile Boat Hoist"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 relative">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 block">Marka Seçimi</label>
                  <button
                    type="button"
                    onClick={() => setIsBrandModalOpen(!isBrandModalOpen)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isBrandModalOpen ? 'Kapat' : '+ Yeni Marka'}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={editingProduct.brandId || brands[0]?.id || 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brandId: Number(e.target.value) })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 font-semibold text-xs"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsBrandModalOpen(!isBrandModalOpen)}
                    title={isBrandModalOpen ? 'Pop-up Kapat' : 'Yeni Marka Ekle'}
                    className={`p-2.5 rounded-xl transition-all shadow-xs shrink-0 flex items-center justify-center ${
                      isBrandModalOpen ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Plus className={`w-5 h-5 transition-transform duration-200 ${isBrandModalOpen ? 'rotate-45' : ''}`} />
                  </button>
                </div>

                {/* Inline Popup for Quick Brand Creation */}
                {isBrandModalOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white border border-blue-200 rounded-2xl p-4 shadow-xl ring-1 ring-blue-500/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        <span>Hızlı Marka Ekle (Pop-up)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsBrandModalOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="font-bold text-slate-700 text-[11px] block mb-1">Marka Adı*</label>
                        <input
                          type="text"
                          value={quickBrand.name}
                          onChange={(e) => setQuickBrand({ ...quickBrand, name: e.target.value })}
                          placeholder="Örn: Caterpillar, Tadano"
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>

                      <ImageUploader
                        label="Marka Logosu (İsteğe Bağlı)"
                        value={quickBrand.logoUrl}
                        onChange={(url) => setQuickBrand({ ...quickBrand, logoUrl: url })}
                        helperText="Logo görseli yükleyin"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 text-[11px] block mb-1">Açıklama (TR)</label>
                          <input
                            type="text"
                            value={quickBrand.descriptionTr}
                            onChange={(e) => setQuickBrand({ ...quickBrand, descriptionTr: e.target.value })}
                            placeholder="Marka hakkında bilgi (TR)"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 text-[11px] block mb-1">Description (EN)</label>
                          <input
                            type="text"
                            value={quickBrand.descriptionEn}
                            onChange={(e) => setQuickBrand({ ...quickBrand, descriptionEn: e.target.value })}
                            placeholder="Brand description (EN)"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsBrandModalOpen(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-[11px] transition-colors"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCreateQuickBrand()}
                        disabled={savingQuickBrand || !quickBrand.name.trim()}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-[11px] transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingQuickBrand ? 'Ekleniyor...' : 'Markayı Ekle ve Seç'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <ImageUploader
                label="Ürün Ana Görseli"
                value={editingProduct.primaryImage || ''}
                onFileSelect={(file) => setSelectedFile(file)}
                onChange={(url) => setEditingProduct({ ...editingProduct, primaryImage: url })}
                helperText="Ürün için bilgisayarınızdan görsel yükleyin (PNG, JPG, WEBP)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Özet Açıklama (TR)</label>
                <textarea
                  rows={2}
                  value={editingProduct.summaryTr || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, summaryTr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Summary Description (EN)</label>
                <textarea
                  rows={2}
                  value={editingProduct.summaryEn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, summaryEn: e.target.value })}
                  placeholder="Short summary in English"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <RichContentEditor
                label="Detaylı Açıklama / Özellikler (TR & EN)"
                valueTr={editingProduct.contentTr || ''}
                valueEn={editingProduct.contentEn || ''}
                onChangeTr={(html) => setEditingProduct((prev) => prev ? { ...prev, contentTr: html } : null)}
                onChangeEn={(html) => setEditingProduct((prev) => prev ? { ...prev, contentEn: html } : null)}
                helperText="Ürün açıklaması ve teknik detayları Türkçe ve İngilizce sekmelerinden doldurun."
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={Boolean(editingProduct.featured)}
                  onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Öne Çıkan Ürün Yap</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={Boolean(editingProduct.isActive)}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Aktif Göster</span>
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
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-xs"
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
