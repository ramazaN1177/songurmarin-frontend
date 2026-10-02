import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight, ShieldCheck, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

// Social Media SVG Icons
const IconLinkedin = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const IconInstagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const IconFacebook = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const IconYoutube = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { getSetting } = useSettings();

  const phone = getSetting('phone', language, '+90 542 216 99 06');
  const email = getSetting('email', language, 'bekir.songur@songurmarin.com');
  const address = getSetting('address', language, 'M.Sinan Mah. Üsküdar Cad. Yedpa Tic Mrkz. No:1 F Cad. F 301 Ataşehir-İstanbul');
  const companyName = getSetting('company_name', language, 'Songur Marin Makine San. ve Tic. Ltd. Şti.');
  const companySubtitle = getSetting('company_subtitle', language, 'Authorized Sales & Technical Service Rep.');
  const footerDesc = getSetting('footer_desc', language, t('footerDesc'));
  const copyrightText = getSetting('copyright_text', language, t('rightsReserved'));

  const linkedin = getSetting('social_linkedin', language, '');
  const instagram = getSetting('social_instagram', language, '');
  const facebook = getSetting('social_facebook', language, '');
  const youtube = getSetting('social_youtube', language, '');
  const whatsapp = getSetting('whatsapp_number', language, '+905422169906');

  return (
    <footer className="bg-[#050C17] text-slate-400 pt-16 pb-8 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Col 1: Brand Info & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/songurmarinlogo.png" 
                alt="Songur Marin Logo" 
                className="h-10 sm:h-12 w-auto object-contain self-center" 
              />
              <div className="flex flex-col justify-center self-center">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white uppercase font-heading leading-none">
                  SONGUR MARİN
                </span>
                <span className="text-[9px] text-cyan-400 tracking-widest font-semibold uppercase mt-0.5">
                  Makine & Ekipman San.
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              {footerDesc}
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-cyan-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{companySubtitle}</span>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-2">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-slate-400 transition-colors" aria-label="LinkedIn">
                  <IconLinkedin className="w-4 h-4" />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-slate-400 transition-colors" aria-label="Instagram">
                  <IconInstagram className="w-4 h-4" />
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-slate-400 transition-colors" aria-label="Facebook">
                  <IconFacebook className="w-4 h-4" />
                </a>
              )}
              {youtube && (
                <a href={youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-slate-400 transition-colors" aria-label="YouTube">
                  <IconYoutube className="w-4 h-4" />
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-400 transition-colors" aria-label="WhatsApp">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Corporate Links */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {t('navCorporate')}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/kurumsal/hakkimizda" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('navAboutUs')}</span>
                </Link>
              </li>
              <li>
                <Link to="/kurumsal/misyon-vizyon" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('navMissionVision')}</span>
                </Link>
              </li>
              <li>
                <Link to="/kvkk" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('navKvkk')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Products & Services Links */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/markalar" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('navBrands')}</span>
                </Link>
              </li>
              <li>
                <Link to="/urunler" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('navProducts')}</span>
                </Link>
              </li>
              <li>
                <Link to="/hizmetler" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('navServices')}</span>
                </Link>
              </li>
              <li>
                <Link to="/galeri" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('navGallery')}</span>
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('navContact')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact details */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {t('contactUs')}
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {companyName} {copyrightText}</p>
          <div className="flex items-center gap-6">
            <Link to="/kvkk" className="hover:text-slate-300 transition-colors">{t('navKvkk')}</Link>
            <span className="text-slate-700">•</span>
            <Link to="/iletisim" className="hover:text-slate-300 transition-colors">{t('navContact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
