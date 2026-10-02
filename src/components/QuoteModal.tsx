import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, ShieldCheck, Loader2, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/client';
import { Modal } from './common/Modal';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductOrService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, initialProductOrService }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    productOrService: initialProductOrService || '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialProductOrService) {
      setFormData(prev => ({
        ...prev,
        productOrService: initialProductOrService
      }));
    }
  }, [initialProductOrService, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.submitForm(formData);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      productOrService: '',
      message: ''
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fiyat & Teknik Teklif Talebi"
      subtitle="Songur Marin mühendislik uzmanlarımız talebiniz doğrultusunda en kısa sürede sizinle iletişime geçecektir."
      icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
      maxWidth="lg"
    >
      {submitted ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-black text-slate-900 font-heading">
            Talebiniz Başarıyla Alındı!
          </h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Uzman mühendislerimiz {formData.productOrService ? `"${formData.productOrService}"` : 'talebiniz'} için hazırlanan resmi teklifi en kısa sürede tarafınıza iletecektir.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all text-xs"
          >
            Tamam / Kapat
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {formData.productOrService && (
            <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-600 font-medium">Seçili Model / Hizmet:</span>
              <span className="font-extrabold text-blue-800 truncate">{formData.productOrService}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block font-bold text-slate-800">
                {t('formFullName')}*
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-xs"
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-slate-800">
                {t('formCompanyName')}
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-xs"
                placeholder="Örn: Marina A.Ş."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block font-bold text-slate-800">
                {t('formPhone')}*
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-xs"
                placeholder="Örn: +90 532 000 00 00"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-slate-800">
                {t('formEmail')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-xs"
                placeholder="Örn: info@marina.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-800">
              {t('formMessage')}
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-xs resize-none"
              placeholder="Talep ettiğiniz kaldırma kapasitesi, teslimat tarihi veya ek sorularınız..."
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-blue-600" /> +90 542 216 99 06</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold transition-all text-xs"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 text-xs transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Teklif İste</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      )}
    </Modal>
  );
};

