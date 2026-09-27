import React, { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle2, Globe, Share2, ShieldCheck, Map, Search, Image as ImageIcon } from 'lucide-react';
import { apiService } from '../../api/client';
import { useSettings } from '../../context/SettingsContext';
import { ImageUploader } from '../../components/admin/ImageUploader';

export const AdminSettings: React.FC = () => {
  const { refreshSettings } = useSettings();
  
  // State for all settings
  const [settings, setSettings] = useState({
    phoneTr: '+90 (216) 123 45 67',
    phoneEn: '+90 (216) 123 45 67',
    emailTr: 'info@songurmarin.com',
    emailEn: 'info@songurmarin.com',
    addressTr: 'Tersaneler Bölgesi, Evliya Çelebi Mah. Güzelyalı Cad. No:45 Tuzla / İSTANBUL',
    addressEn: 'Shipyards District, Evliya Celebi St. No:45 Tuzla / ISTANBUL',
    workingHoursTr: 'Pazartesi - Cuma: 08:30 - 18:00',
    workingHoursEn: 'Monday - Friday: 08:30 - 18:00',
    whatsappNumber: '+905321234567',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12062.88514571994!2d29.288220000000002!3d40.82424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cadc1e626e2e21%3A0x6b87be9823901b0!2sTuzla%2C%20%C4%B0stanbul!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str',
    companyNameTr: 'Songur Marin Makine San. ve Tic. Ltd. Şti.',
    companyNameEn: 'Songur Marin Machinery Co. Ltd.',
    companySubtitleTr: 'Yetkili Satış ve Teknik Servis Temsilciliği',
    companySubtitleEn: 'Authorized Sales & Technical Service Rep.',
    footerDescTr: 'Songur Marin Makine; marin vinçleri, mobil boat hoist, bot taşıyıcılar ve ağır sanayi kaldırma ekipmanlarında güvenilir çözüm ortağınızdır.',
    footerDescEn: 'Songur Marin Machinery is your reliable solution partner in marine hoists, mobile boat hoists, boat transporters, and heavy industrial lifting equipment.',
    copyrightTextTr: 'Tüm Hakları Saklıdır.',
    copyrightTextEn: 'All Rights Reserved.',
    socialLinkedin: 'https://linkedin.com/company/songurmarin',
    socialInstagram: 'https://instagram.com/songurmarin',
    socialFacebook: 'https://facebook.com/songurmarin',
    socialYoutube: 'https://youtube.com/@songurmarin',
    metaTitleTr: 'Songur Marin Makine — Denizcilik Sektöründe Güvenilir Çözüm Ortağınız',
    metaTitleEn: 'Songur Marin Machinery — Your Reliable Partner in the Maritime Industry',
    metaDescriptionTr: 'Marina, liman ve tersane projeleri için ağır kaldırma ekipmanları. Cimolai, Marine Travelift, Ascom ve Boat Lift yetkili temsilcisi.',
    metaDescriptionEn: 'Heavy lifting equipment for marina, port and shipyard projects. Authorized representative of Cimolai, Marine Travelift, Ascom and Boat Lift.',
    logoUrl: '/songurmarinlogo.png',
    homeAboutImage: '',
    homeCtaImage: '',
  });

  // Selected file states for ImageUploader
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [selectedAboutFile, setSelectedAboutFile] = useState<File | null>(null);
  const [selectedCtaFile, setSelectedCtaFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await apiService.getSettings();
      if (Array.isArray(data) && data.length > 0) {
        const getVal = (key: string, field: 'valueTr' | 'valueEn', fallback: string) => {
          const item = data.find(s => s.key === key);
          return item && item[field] ? item[field]! : fallback;
        };

        setSettings({
          phoneTr: getVal('phone', 'valueTr', settings.phoneTr),
          phoneEn: getVal('phone', 'valueEn', settings.phoneEn),
          emailTr: getVal('email', 'valueTr', settings.emailTr),
          emailEn: getVal('email', 'valueEn', settings.emailEn),
          addressTr: getVal('address', 'valueTr', settings.addressTr),
          addressEn: getVal('address', 'valueEn', settings.addressEn),
          workingHoursTr: getVal('working_hours', 'valueTr', settings.workingHoursTr),
          workingHoursEn: getVal('working_hours', 'valueEn', settings.workingHoursEn),
          whatsappNumber: getVal('whatsapp_number', 'valueTr', settings.whatsappNumber),
          googleMapsEmbed: getVal('google_maps_embed', 'valueTr', settings.googleMapsEmbed),
          companyNameTr: getVal('company_name', 'valueTr', settings.companyNameTr),
          companyNameEn: getVal('company_name', 'valueEn', settings.companyNameEn),
          companySubtitleTr: getVal('company_subtitle', 'valueTr', settings.companySubtitleTr),
          companySubtitleEn: getVal('company_subtitle', 'valueEn', settings.companySubtitleEn),
          footerDescTr: getVal('footer_desc', 'valueTr', settings.footerDescTr),
          footerDescEn: getVal('footer_desc', 'valueEn', settings.footerDescEn),
          copyrightTextTr: getVal('copyright_text', 'valueTr', settings.copyrightTextTr),
          copyrightTextEn: getVal('copyright_text', 'valueEn', settings.copyrightTextEn),
          socialLinkedin: getVal('social_linkedin', 'valueTr', settings.socialLinkedin),
          socialInstagram: getVal('social_instagram', 'valueTr', settings.socialInstagram),
          socialFacebook: getVal('social_facebook', 'valueTr', settings.socialFacebook),
          socialYoutube: getVal('social_youtube', 'valueTr', settings.socialYoutube),
          metaTitleTr: getVal('meta_title', 'valueTr', settings.metaTitleTr),
          metaTitleEn: getVal('meta_title', 'valueEn', settings.metaTitleEn),
          metaDescriptionTr: getVal('meta_description', 'valueTr', settings.metaDescriptionTr),
          metaDescriptionEn: getVal('meta_description', 'valueEn', settings.metaDescriptionEn),
          logoUrl: getVal('logo_url', 'valueTr', settings.logoUrl),
          homeAboutImage: getVal('home_about_image', 'valueTr', settings.homeAboutImage),
          homeCtaImage: getVal('home_cta_image', 'valueTr', settings.homeCtaImage),
        });
      }
    } catch {
      // Keep default state
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      let finalLogoUrl = settings.logoUrl;
      let finalAboutImg = settings.homeAboutImage;
      let finalCtaImg = settings.homeCtaImage;

      // Handle logo upload
      if (selectedLogoFile) {
        const uploadRes = await apiService.uploadFile(selectedLogoFile);
        if (settings.logoUrl && settings.logoUrl !== uploadRes.url) {
          await apiService.deleteFile(settings.logoUrl);
        }
        finalLogoUrl = uploadRes.url;
      }

      // Handle home about image upload
      if (selectedAboutFile) {
        const uploadRes = await apiService.uploadFile(selectedAboutFile);
        if (settings.homeAboutImage && settings.homeAboutImage !== uploadRes.url) {
          await apiService.deleteFile(settings.homeAboutImage);
        }
        finalAboutImg = uploadRes.url;
      }

      // Handle home cta image upload
      if (selectedCtaFile) {
        const uploadRes = await apiService.uploadFile(selectedCtaFile);
        if (settings.homeCtaImage && settings.homeCtaImage !== uploadRes.url) {
          await apiService.deleteFile(settings.homeCtaImage);
        }
        finalCtaImg = uploadRes.url;
      }

      await Promise.all([
        apiService.updateSetting('phone', { valueTr: settings.phoneTr, valueEn: settings.phoneEn }),
        apiService.updateSetting('email', { valueTr: settings.emailTr, valueEn: settings.emailEn }),
        apiService.updateSetting('address', { valueTr: settings.addressTr, valueEn: settings.addressEn }),
        apiService.updateSetting('working_hours', { valueTr: settings.workingHoursTr, valueEn: settings.workingHoursEn }),
        apiService.updateSetting('whatsapp_number', { valueTr: settings.whatsappNumber, valueEn: settings.whatsappNumber }),
        apiService.updateSetting('google_maps_embed', { valueTr: settings.googleMapsEmbed, valueEn: settings.googleMapsEmbed }),
        apiService.updateSetting('company_name', { valueTr: settings.companyNameTr, valueEn: settings.companyNameEn }),
        apiService.updateSetting('company_subtitle', { valueTr: settings.companySubtitleTr, valueEn: settings.companySubtitleEn }),
        apiService.updateSetting('footer_desc', { valueTr: settings.footerDescTr, valueEn: settings.footerDescEn }),
        apiService.updateSetting('copyright_text', { valueTr: settings.copyrightTextTr, valueEn: settings.copyrightTextEn }),
        apiService.updateSetting('social_linkedin', { valueTr: settings.socialLinkedin, valueEn: settings.socialLinkedin }),
        apiService.updateSetting('social_instagram', { valueTr: settings.socialInstagram, valueEn: settings.socialInstagram }),
        apiService.updateSetting('social_facebook', { valueTr: settings.socialFacebook, valueEn: settings.socialFacebook }),
        apiService.updateSetting('social_youtube', { valueTr: settings.socialYoutube, valueEn: settings.socialYoutube }),
        apiService.updateSetting('meta_title', { valueTr: settings.metaTitleTr, valueEn: settings.metaTitleEn }),
        apiService.updateSetting('meta_description', { valueTr: settings.metaDescriptionTr, valueEn: settings.metaDescriptionEn }),
        apiService.updateSetting('logo_url', { valueTr: finalLogoUrl, valueEn: finalLogoUrl }),
        apiService.updateSetting('home_about_image', { valueTr: finalAboutImg, valueEn: finalAboutImg }),
        apiService.updateSetting('home_cta_image', { valueTr: finalCtaImg, valueEn: finalCtaImg }),
      ]);

      setSelectedLogoFile(null);
      setSelectedAboutFile(null);
      setSelectedCtaFile(null);

      await refreshSettings();
      setSavedSuccess(true);
    } catch (err) {
      console.error('Settings save error:', err);
      setErrorMessage('Ayarlar sunucuya kaydedilemedi. Lütfen bağlantınızı kontrol edin.');
    } finally {
      setSaving(false);
      setTimeout(() => setSavedSuccess(false), 5000);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-xs">Ayar verileri yükleniyor...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">Site Genel Ayarları & Görsel Yönetimi</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            İletişim bilgileri, adres, banner görselleri, logo, footer, sosyal medya ve SEO ayarlarını yönetin
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Tüm site ayarları ve banner görselleri veritabanına kaydedildi ve canlıya alındı.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: İletişim & Konum Bilgileri */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Phone className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 font-heading">1. İletişim & Konum Bilgileri</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Telefon Numarası</span>
              </label>
              <input
                type="text"
                value={settings.phoneTr}
                onChange={(e) => setSettings({ ...settings, phoneTr: e.target.value, phoneEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="+90 (216) 123 45 67"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>E-Posta Adresi</span>
              </label>
              <input
                type="email"
                value={settings.emailTr}
                onChange={(e) => setSettings({ ...settings, emailTr: e.target.value, emailEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="info@songurmarin.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Çalışma Saatleri (TR)</span>
              </label>
              <input
                type="text"
                value={settings.workingHoursTr}
                onChange={(e) => setSettings({ ...settings, workingHoursTr: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="Pazartesi - Cuma: 08:30 - 18:00"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Working Hours (EN)</span>
              </label>
              <input
                type="text"
                value={settings.workingHoursEn}
                onChange={(e) => setSettings({ ...settings, workingHoursEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="Monday - Friday: 08:30 - 18:00"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp İletişim Numarası</span>
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="+905321234567"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Adres Bilgisi (TR)</span>
              </label>
              <textarea
                rows={2}
                value={settings.addressTr}
                onChange={(e) => setSettings({ ...settings, addressTr: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="Tersaneler Bölgesi, Evliya Çelebi Mah. Güzelyalı Cad. No:45 Tuzla / İSTANBUL"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Address Details (EN)</span>
              </label>
              <textarea
                rows={2}
                value={settings.addressEn}
                onChange={(e) => setSettings({ ...settings, addressEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="Shipyards District, Evliya Celebi St. No:45 Tuzla / ISTANBUL"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Map className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Harita Embed (Iframe Src URL)</span>
              </label>
              <input
                type="text"
                value={settings.googleMapsEmbed}
                onChange={(e) => setSettings({ ...settings, googleMapsEmbed: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-mono text-[11px]"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <span className="text-[10px] text-slate-400 block">
                Google Haritalar'dan "Haritayı Yerleştir" seçeneğindeki iframe linkinin 'src' adresini yapıştırın.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Kurumsal & Footer Metinleri */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 font-heading">2. Firma & Footer Ayarları</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Şirket Resmi Adı (TR)</label>
              <input
                type="text"
                value={settings.companyNameTr}
                onChange={(e) => setSettings({ ...settings, companyNameTr: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Company Official Name (EN)</label>
              <input
                type="text"
                value={settings.companyNameEn}
                onChange={(e) => setSettings({ ...settings, companyNameEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Rozet / Temsilcilik Alt Başlığı (TR)</label>
              <input
                type="text"
                value={settings.companySubtitleTr}
                onChange={(e) => setSettings({ ...settings, companySubtitleTr: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Badge / Subtitle Text (EN)</label>
              <input
                type="text"
                value={settings.companySubtitleEn}
                onChange={(e) => setSettings({ ...settings, companySubtitleEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700 block">Footer Tanıtım Açıklaması (TR)</label>
              <textarea
                rows={2}
                value={settings.footerDescTr}
                onChange={(e) => setSettings({ ...settings, footerDescTr: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700 block">Footer Description (EN)</label>
              <textarea
                rows={2}
                value={settings.footerDescEn}
                onChange={(e) => setSettings({ ...settings, footerDescEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Telif Hakkı Metni (TR)</label>
              <input
                type="text"
                value={settings.copyrightTextTr}
                onChange={(e) => setSettings({ ...settings, copyrightTextTr: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Copyright Text (EN)</label>
              <input
                type="text"
                value={settings.copyrightTextEn}
                onChange={(e) => setSettings({ ...settings, copyrightTextEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Sosyal Medya Bağlantıları */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 font-heading">3. Sosyal Medya Bağlantıları</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">LinkedIn Profil URL</label>
              <input
                type="url"
                value={settings.socialLinkedin}
                onChange={(e) => setSettings({ ...settings, socialLinkedin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="https://linkedin.com/company/songurmarin"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Instagram Profil URL</label>
              <input
                type="url"
                value={settings.socialInstagram}
                onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="https://instagram.com/songurmarin"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Facebook Sayfa URL</label>
              <input
                type="url"
                value={settings.socialFacebook}
                onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="https://facebook.com/songurmarin"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">YouTube Kanal URL</label>
              <input
                type="url"
                value={settings.socialYoutube}
                onChange={(e) => setSettings({ ...settings, socialYoutube: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
                placeholder="https://youtube.com/@songurmarin"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Görsel Yönetimi & Afişler */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 font-heading">4. Görsel Yönetimi & Bölüm Bannerları</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <ImageUploader
                label="Ana Sayfa Hakkımızda Görseli"
                value={settings.homeAboutImage}
                onFileSelect={(file) => setSelectedAboutFile(file)}
                onChange={(url) => setSettings({ ...settings, homeAboutImage: url })}
                helperText="Ana sayfadaki hakkımızda tanıtım bölümünün sağ tarafındaki görsel"
              />
            </div>

            <div>
              <ImageUploader
                label="Ana Sayfa CTA / Teklif Afiş Görseli"
                value={settings.homeCtaImage}
                onFileSelect={(file) => setSelectedCtaFile(file)}
                onChange={(url) => setSettings({ ...settings, homeCtaImage: url })}
                helperText="Ana sayfanın altındaki teklif al çağrı bannerının arka plan görseli"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: SEO & Meta Ayarları */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 font-heading">5. SEO & Meta Ayarları</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Site Meta Başlığı (TR)</label>
              <input
                type="text"
                value={settings.metaTitleTr}
                onChange={(e) => setSettings({ ...settings, metaTitleTr: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Site Meta Title (EN)</label>
              <input
                type="text"
                value={settings.metaTitleEn}
                onChange={(e) => setSettings({ ...settings, metaTitleEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700 block">Site Meta Açıklaması (TR)</label>
              <textarea
                rows={2}
                value={settings.metaDescriptionTr}
                onChange={(e) => setSettings({ ...settings, metaDescriptionTr: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700 block">Site Meta Description (EN)</label>
              <textarea
                rows={2}
                value={settings.metaDescriptionEn}
                onChange={(e) => setSettings({ ...settings, metaDescriptionEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Veriler Kaydediliyor...' : 'Tüm Ayarları Kaydet'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
