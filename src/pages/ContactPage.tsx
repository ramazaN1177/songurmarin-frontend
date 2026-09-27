import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { apiService } from '../api/client';

export const ContactPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { getSetting } = useSettings();

  const phone = getSetting('phone', language, '+90 (216) 123 45 67');
  const email = getSetting('email', language, 'info@songurmarin.com');
  const address = getSetting('address', language, 'Tersaneler Bölgesi, Evliya Çelebi Mah. Güzelyalı Cad. No:45 Tuzla / İstanbul - Türkiye');
  const workingHours = getSetting('working_hours', language, 'Pzt - Cmt: 08:30 - 18:00');
  const companyName = getSetting('company_name', language, 'Songur Marin Makine San. ve Tic. Ltd. Şti.');
  const mapEmbedUrl = getSetting('google_maps_embed', language, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.6668748374!2d29.1643463!3d40.9836263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cacf60c005a54b%3A0xd6599952ce6f575b!2sYedpa!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str');
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-blue-700" />
            <span>{t('navContact')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
            İletişim & Konum Bilgileri
          </h1>
          <p className="text-slate-600 text-base font-light">
            Marina ve tersane ekipman ihtiyacınız için uzman ekibimize 7/24 ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details & Map */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 font-heading border-b border-slate-100 pb-4">
                {companyName}
              </h3>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Fabrika & Merkez Adres:</strong>
                    <span>{address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">Telefon / WhatsApp:</strong>
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-blue-700 transition-colors">{phone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">E-posta:</strong>
                    <a href={`mailto:${email}`} className="hover:text-blue-700 transition-colors">{email}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">Çalışma Saatleri:</strong>
                    <span>{workingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Embed Container */}
            <div className="aspect-[16/10] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <iframe
                title="Songur Marin Map"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>

          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 font-heading">{t('formTitle')}</h3>

            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto border border-blue-200">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 font-heading">Mesajınız İletildi</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">{t('formSuccess')}</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ fullName: '', companyName: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="px-6 py-2.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 text-sm transition-colors"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('formFullName')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('formCompanyName')}</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                      placeholder="Şirketiniz"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('formEmail')} *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                      placeholder="eposta@adresi.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('formPhone')} *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('formSubject')}</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                    placeholder="Konu (Örn: 500 Ton Boat Hoist Teklifi)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('formMessage')} *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                    placeholder="Proje detaylarınız, yerleşim bilgileri veya sorunuz..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold py-4 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
                >
                  {loading ? (
                    <span>Gönderiliyor...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('formSend')}</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
