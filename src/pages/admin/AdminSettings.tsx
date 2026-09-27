import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle2, Globe, 
  Share2, ShieldCheck, Map, Search, Image as ImageIcon, Download, Upload 
} from 'lucide-react';
import { apiService } from '../../api/client';
import { useSettings } from '../../context/SettingsContext';
import { ImageUploader } from '../../components/admin/ImageUploader';

export const AdminSettings: React.FC = () => {
  const { refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'contact' | 'company' | 'social' | 'branding' | 'seo'>('contact');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for all site settings
  const [settings, setSettings] = useState({
    phoneTr: '+90 542 216 99 06',
    phoneEn: '+90 542 216 99 06',
    emailTr: 'bekir.songur@songurmarin.com',
    emailEn: 'bekir.songur@songurmarin.com',
    addressTr: 'M.Sinan Mah. Üsküdar Cad. Yedpa Tic Mrkz. No:1 F Cad. F 301 Ataşehir-İstanbul',
    addressEn: 'M.Sinan Mah. Üsküdar Cad. Yedpa Tic Mrkz. No:1 F Cad. F 301 Ataşehir-Istanbul',
    workingHoursTr: 'Pazartesi - Cuma: 08:30 - 18:00',
    workingHoursEn: 'Monday - Friday: 08:30 - 18:00',
    whatsappNumber: '+905422169906',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.6668748374!2d29.1643463!3d40.9836263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cacf60c005a54b%3A0xd6599952ce6f575b!2sYedpa!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str',
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
    homeAboutImage: '',
    homeCtaImage: '',
  });

  const [selectedHomeAboutFile, setSelectedHomeAboutFile] = useState<File | null>(null);
  const [selectedHomeCtaFile, setSelectedHomeCtaFile] = useState<File | null>(null);

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
          const item = data.find((s: any) => {
            const rec = s as unknown as Record<string, unknown>;
            return (rec.key || rec.settingKey || rec.settingkey) === key;
          });
          if (!item) return fallback;
          const rec = item as unknown as Record<string, unknown>;
          const trVal = (item as any).valueTr ?? rec.valuetr ?? rec.value_tr;
          const enVal = (item as any).valueEn ?? rec.valueen ?? rec.value_en ?? trVal;
          const val = field === 'valueTr' ? trVal : enVal;
          return val !== undefined && val !== null && val !== '' ? String(val) : fallback;
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

  // Single JSON object payload save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      let finalHomeAboutImage = settings.homeAboutImage;
      let finalHomeCtaImage = settings.homeCtaImage;

      // Handle home about image upload
      if (selectedHomeAboutFile) {
        const uploadRes = await apiService.uploadFile(selectedHomeAboutFile);
        finalHomeAboutImage = uploadRes.url;
      }

      // Handle home cta image upload
      if (selectedHomeCtaFile) {
        const uploadRes = await apiService.uploadFile(selectedHomeCtaFile);
        finalHomeCtaImage = uploadRes.url;
      }

      // Construct single JSON payload dictionary
      const singleJsonPayload: Record<string, { valueTr: string; valueEn: string }> = {
        phone: { valueTr: settings.phoneTr, valueEn: settings.phoneEn },
        email: { valueTr: settings.emailTr, valueEn: settings.emailEn },
        address: { valueTr: settings.addressTr, valueEn: settings.addressEn },
        working_hours: { valueTr: settings.workingHoursTr, valueEn: settings.workingHoursEn },
        whatsapp_number: { valueTr: settings.whatsappNumber, valueEn: settings.whatsappNumber },
        google_maps_embed: { valueTr: settings.googleMapsEmbed, valueEn: settings.googleMapsEmbed },
        company_name: { valueTr: settings.companyNameTr, valueEn: settings.companyNameEn },
        company_subtitle: { valueTr: settings.companySubtitleTr, valueEn: settings.companySubtitleEn },
        footer_desc: { valueTr: settings.footerDescTr, valueEn: settings.footerDescEn },
        copyright_text: { valueTr: settings.copyrightTextTr, valueEn: settings.copyrightTextEn },
        social_linkedin: { valueTr: settings.socialLinkedin, valueEn: settings.socialLinkedin },
        social_instagram: { valueTr: settings.socialInstagram, valueEn: settings.socialInstagram },
        social_facebook: { valueTr: settings.socialFacebook, valueEn: settings.socialFacebook },
        social_youtube: { valueTr: settings.socialYoutube, valueEn: settings.socialYoutube },
        meta_title: { valueTr: settings.metaTitleTr, valueEn: settings.metaTitleEn },
        meta_description: { valueTr: settings.metaDescriptionTr, valueEn: settings.metaDescriptionEn },
        home_about_image: { valueTr: finalHomeAboutImage, valueEn: finalHomeAboutImage },
        home_cta_image: { valueTr: finalHomeCtaImage, valueEn: finalHomeCtaImage },
      };

      await apiService.updateSettingsBulk(singleJsonPayload);

      setSelectedHomeAboutFile(null);
      setSelectedHomeCtaFile(null);
      
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

  // Export JSON file
  const handleExportJson = () => {
    const exportData = {
      phone: { valueTr: settings.phoneTr, valueEn: settings.phoneEn },
      email: { valueTr: settings.emailTr, valueEn: settings.emailEn },
      address: { valueTr: settings.addressTr, valueEn: settings.addressEn },
      working_hours: { valueTr: settings.workingHoursTr, valueEn: settings.workingHoursEn },
      whatsapp_number: { valueTr: settings.whatsappNumber, valueEn: settings.whatsappNumber },
      google_maps_embed: { valueTr: settings.googleMapsEmbed, valueEn: settings.googleMapsEmbed },
      company_name: { valueTr: settings.companyNameTr, valueEn: settings.companyNameEn },
      company_subtitle: { valueTr: settings.companySubtitleTr, valueEn: settings.companySubtitleEn },
      footer_desc: { valueTr: settings.footerDescTr, valueEn: settings.footerDescEn },
      copyright_text: { valueTr: settings.copyrightTextTr, valueEn: settings.copyrightTextEn },
      social_linkedin: { valueTr: settings.socialLinkedin, valueEn: settings.socialLinkedin },
      social_instagram: { valueTr: settings.socialInstagram, valueEn: settings.socialInstagram },
      social_facebook: { valueTr: settings.socialFacebook, valueEn: settings.socialFacebook },
      social_youtube: { valueTr: settings.socialYoutube, valueEn: settings.socialYoutube },
      meta_title: { valueTr: settings.metaTitleTr, valueEn: settings.metaTitleEn },
      meta_description: { valueTr: settings.metaDescriptionTr, valueEn: settings.metaDescriptionEn },
      home_about_image: { valueTr: settings.homeAboutImage, valueEn: settings.homeAboutImage },
      home_cta_image: { valueTr: settings.homeCtaImage, valueEn: settings.homeCtaImage },
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "songur_marin_settings.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (typeof imported === 'object' && imported !== null) {
          const getVal = (key: string, field: 'valueTr' | 'valueEn', fallback: string) => {
            if (imported[key]) {
              return imported[key][field] || imported[key].valueTr || imported[key].tr || fallback;
            }
            return fallback;
          };

          setSettings((prev) => ({
            phoneTr: getVal('phone', 'valueTr', prev.phoneTr),
            phoneEn: getVal('phone', 'valueEn', prev.phoneEn),
            emailTr: getVal('email', 'valueTr', prev.emailTr),
            emailEn: getVal('email', 'valueEn', prev.emailEn),
            addressTr: getVal('address', 'valueTr', prev.addressTr),
            addressEn: getVal('address', 'valueEn', prev.addressEn),
            workingHoursTr: getVal('working_hours', 'valueTr', prev.workingHoursTr),
            workingHoursEn: getVal('working_hours', 'valueEn', prev.workingHoursEn),
            whatsappNumber: getVal('whatsapp_number', 'valueTr', prev.whatsappNumber),
            googleMapsEmbed: getVal('google_maps_embed', 'valueTr', prev.googleMapsEmbed),
            companyNameTr: getVal('company_name', 'valueTr', prev.companyNameTr),
            companyNameEn: getVal('company_name', 'valueEn', prev.companyNameEn),
            companySubtitleTr: getVal('company_subtitle', 'valueTr', prev.companySubtitleTr),
            companySubtitleEn: getVal('company_subtitle', 'valueEn', prev.companySubtitleEn),
            footerDescTr: getVal('footer_desc', 'valueTr', prev.footerDescTr),
            footerDescEn: getVal('footer_desc', 'valueEn', prev.footerDescEn),
            copyrightTextTr: getVal('copyright_text', 'valueTr', prev.copyrightTextTr),
            copyrightTextEn: getVal('copyright_text', 'valueEn', prev.copyrightTextEn),
            socialLinkedin: getVal('social_linkedin', 'valueTr', prev.socialLinkedin),
            socialInstagram: getVal('social_instagram', 'valueTr', prev.socialInstagram),
            socialFacebook: getVal('social_facebook', 'valueTr', prev.socialFacebook),
            socialYoutube: getVal('social_youtube', 'valueTr', prev.socialYoutube),
            metaTitleTr: getVal('meta_title', 'valueTr', prev.metaTitleTr),
            metaTitleEn: getVal('meta_title', 'valueEn', prev.metaTitleEn),
            metaDescriptionTr: getVal('meta_description', 'valueTr', prev.metaDescriptionTr),
            metaDescriptionEn: getVal('meta_description', 'valueEn', prev.metaDescriptionEn),
            homeAboutImage: getVal('home_about_image', 'valueTr', prev.homeAboutImage),
            homeCtaImage: getVal('home_cta_image', 'valueTr', prev.homeCtaImage),
          }));

          setSavedSuccess(false);
          alert('JSON ayar dosyası başarıyla içe aktarıldı. Değişiklikleri uygulamak için "Değişiklikleri Kaydet" butonuna tıklayın.');
        }
      } catch (err) {
        alert('Geçersiz JSON dosyası formatı!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs font-bold text-slate-600">Ayar verileri yükleniyor...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'contact', label: 'İletişim & Konum', icon: <Phone className="w-4 h-4" /> },
    { id: 'company', label: 'Şirket & Footer', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'social', label: 'Sosyal Medya', icon: <Share2 className="w-4 h-4" /> },
    { id: 'branding', label: 'Sayfa Banner Görselleri', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO & Meta', icon: <Search className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      
      {/* Header Banner with JSON Import / Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">Site Genel Ayarları</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tüm site bilgilerini, haritaları ve banner görsellerini tek bir JSON yapısıyla yönetin
          </p>
        </div>

        {/* JSON Import/Export Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
            title="Tüm ayarları JSON dosyası olarak indir"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>JSON İndir</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
            title="Hazır JSON dosyasından ayarları yükle"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>JSON Yükle</span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportJson}
            className="hidden"
          />
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Tüm site ayarları tek seferde veritabanına kaydedildi ve canlı web sitesinde güncellendi.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab Selector Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300/60">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-blue-700 shadow-md scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Area */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* TAB 1: İletişim & Konum Bilgileri */}
        {activeTab === 'contact' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Phone className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 font-heading">İletişim, Adres & Konum Bilgileri</h2>
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
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Şirket & Footer Metinleri */}
        {activeTab === 'company' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 font-heading">Firma Ünvanı & Footer Ayarları</h2>
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
                <label className="font-bold text-slate-700 block">Rozet / Alt Başlık Metni (TR)</label>
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
        )}

        {/* TAB 3: Sosyal Medya Bağlantıları */}
        {activeTab === 'social' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Share2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 font-heading">Sosyal Medya Profil Bağlantıları</h2>
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
        )}

        {/* TAB 4: Sayfa Banner Görselleri */}
        {activeTab === 'branding' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 font-heading">Sayfa Banner Görselleri</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <ImageUploader
                  label="Ana Sayfa Hakkımızda Bölümü Görseli"
                  value={settings.homeAboutImage}
                  onFileSelect={(file) => setSelectedHomeAboutFile(file)}
                  onChange={(url) => setSettings({ ...settings, homeAboutImage: url })}
                  helperText="Ana sayfadaki tanıtım bölümünde görünecek yüksek çözünürlüklü fotoğraf"
                />
              </div>

              <div className="space-y-2">
                <ImageUploader
                  label="Ana Sayfa Alt Teklif ÇAĞRI (CTA) Banner Arka Planı"
                  value={settings.homeCtaImage}
                  onFileSelect={(file) => setSelectedHomeCtaFile(file)}
                  onChange={(url) => setSettings({ ...settings, homeCtaImage: url })}
                  helperText="Ana sayfanın en altındaki teklif alma banner'ının arka plan fotoğrafı"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SEO & Meta Ayarları */}
        {activeTab === 'seo' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Search className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 font-heading">Arama Motoru (SEO) & Meta Ayarları</h2>
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
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-slate-200/80">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Veriler Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
