import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

// Flag TR SVG
const FlagTR: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={`${className} rounded-full shadow-sm shrink-0`} viewBox="0 0 640 480">
    <path fill="#e30a17" d="M0 0h640v480H0z"/>
    <path fill="#fff" d="M407 240c0 66.27-53.73 120-120 120s-120-53.73-120-120 53.73-120 120-120 120 53.73 120 120z"/>
    <path fill="#e30a17" d="M413 240c0 53.02-42.98 96-96 96s-96-42.98-96-96 42.98-96 96-96 96 42.98 96 96z"/>
    <path fill="#fff" d="m409.8 240-35.8-11.6 22.1 29.5v-35.8l-22.1 29.5z"/>
  </svg>
);

// Flag EN (UK) SVG
const FlagEN: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={`${className} rounded-full shadow-sm shrink-0`} viewBox="0 0 640 480">
    <path fill="#012169" d="M0 0h640v480H0z"/>
    <path fill="#FFF" d="m75 0 245 180L565 0h75v50L440 240l200 190v50h-75L320 300 75 480H0v-50l200-190L0 50V0h75z"/>
    <path fill="#C8102E" d="m424 240 216 162v38l-241-180h25zm-208 0L0 402v38l241-180h-25zm0 0L0 78V40l241 180h-25zm208 0L640 78V40L399 220h25z"/>
    <path fill="#FFF" d="M240 0v480h160V0H240zM0 160v160h640V160H0z"/>
    <path fill="#C8102E" d="M267 0v480h106V0H267zM0 187v106h640V187H0z"/>
  </svg>
);

export const TopBar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { getSetting } = useSettings();

  const phone = getSetting('phone', language, '+90 542 216 99 06');
  const email = getSetting('email', language, 'bekir.songur@songurmarin.com');
  const address = getSetting('address', language, 'Ataşehir, İstanbul - Türkiye');
  const workingHours = getSetting('working_hours', language, 'Pzt - Cmt: 08:30 - 18:00');

  return (
    <div className="hidden md:block bg-blue-950 text-slate-200 text-xs py-2 px-4 border-b border-blue-900/60">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        
        {/* Left Side: Contact details */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:text-sky-400 transition-colors font-medium">
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            <span>{phone}</span>
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-sky-400 transition-colors font-medium">
            <Mail className="w-3.5 h-3.5 text-sky-400" />
            <span>{email}</span>
          </a>
          <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>{address}</span>
          </div>
        </div>

        {/* Right Side: Working hours & Flag Language Switcher Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{workingHours}</span>
          </div>

          <div className="h-3.5 w-px bg-blue-800 hidden sm:block"></div>

          {/* Flag Button Group Language Switcher */}
          <div className="flex items-center gap-1.5 bg-blue-900/90 p-1 rounded-xl border border-blue-700/80 shadow-inner">
            <button
              onClick={() => setLanguage('tr')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                language === 'tr'
                  ? 'bg-sky-400 text-blue-950 shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-blue-800/60'
              }`}
            >
              <FlagTR className="w-4 h-4" />
              <span>TR</span>
            </button>
            
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                language === 'en'
                  ? 'bg-sky-400 text-blue-950 shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-blue-800/60'
              }`}
            >
              <FlagEN className="w-4 h-4" />
              <span>EN</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
