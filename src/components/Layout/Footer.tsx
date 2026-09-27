import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { getSetting } = useSettings();

  const phone = getSetting('phone', language, '+90 (216) 123 45 67');
  const email = getSetting('email', language, 'info@songurmarin.com');
  const address = getSetting('address', language, 'Tersaneler Bölgesi, Evliya Çelebi Mah. Güzelyalı Cad. No:45 Tuzla / İstanbul');

  return (
    <footer className="bg-[#050C17] text-slate-400 pt-16 pb-8 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Col 1: Brand Info */}
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
              {t('footerDesc')}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-cyan-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Authorized Sales & Technical Service Rep.</span>
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
                <Link to="/referanslar" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('navReferences')}</span>
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
          <p>© {new Date().getFullYear()} Songur Marin Makine San. ve Tic. Ltd. Şti. {t('rightsReserved')}</p>
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
