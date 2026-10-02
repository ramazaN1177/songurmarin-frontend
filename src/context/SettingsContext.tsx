import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../api/client';
import type { Language } from '../types';

interface SettingsContextType {
  settings: Record<string, { tr: string; en: string }>;
  getSetting: (key: string, lang?: Language, fallback?: string) => string;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settingsMap, setSettingsMap] = useState<Record<string, { tr: string; en: string }>>({});
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await apiService.getSettings();
      if (Array.isArray(data)) {
        const map: Record<string, { tr: string; en: string }> = {};
        data.forEach((s: any) => {
          const key = s.key || s.settingKey || s.settingkey;
          const trVal = s.valueTr ?? s.valuetr ?? s.value_tr ?? '';
          const enVal = s.valueEn ?? s.valueen ?? s.value_en ?? trVal;
          if (key) {
            map[key] = {
              tr: String(trVal),
              en: String(enVal)
            };
            // Also store snake_case and camelCase aliases
            const camelKey = key.replace(/_([a-z])/g, (_: string, letter: string) => letter.toUpperCase());
            const snakeKey = key.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);
            if (!map[camelKey]) map[camelKey] = map[key];
            if (!map[snakeKey]) map[snakeKey] = map[key];
          }
        });
        setSettingsMap(map);
      }
    } catch {
      // Keep existing map
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const getSetting = (key: string, lang: Language = 'tr', fallback = ''): string => {
    const item = settingsMap[key] || 
                 settingsMap[key.replace(/_([a-z])/g, (_, l) => l.toUpperCase())] ||
                 settingsMap[key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)];
    if (item) {
      const val = item[lang] || item.tr;
      if (val !== undefined && val !== null && val !== '') return val;
    }
    return fallback;
  };

  return (
    <SettingsContext.Provider value={{ settings: settingsMap, getSetting, refreshSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
