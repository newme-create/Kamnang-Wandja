import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light' | 'navy' | 'emerald';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  subtitle: string;
  accentColor: string;
  bgPreview: string;
  textColor: string;
  iconName: 'moon' | 'sun' | 'compass' | 'leaf';
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark',
    name: 'Sombre Chantier',
    subtitle: 'Noir Carbone & Orange BTP',
    accentColor: '#f06a1d',
    bgPreview: '#090b0e',
    textColor: '#f3f4f6',
    iconName: 'moon',
  },
  {
    id: 'light',
    name: 'Clair Architecte',
    subtitle: 'Lumière & Lignes Épurées',
    accentColor: '#ea580c',
    bgPreview: '#f8fafc',
    textColor: '#0f172a',
    iconName: 'sun',
  },
  {
    id: 'navy',
    name: 'Marine Ingénierie',
    subtitle: 'Bleu Abysse & Ambre Doré',
    accentColor: '#f59e0b',
    bgPreview: '#0b1329',
    textColor: '#f1f5f9',
    iconName: 'compass',
  },
  {
    id: 'emerald',
    name: 'Éco-Construction',
    subtitle: 'Vert Forêt & Émeraude Durable',
    accentColor: '#10b981',
    bgPreview: '#081c15',
    textColor: '#ecfdf5',
    iconName: 'leaf',
  },
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  currentThemeOption: ThemeOption;
}

const THEME_STORAGE_KEY = 'batir_pro_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved && ['dark', 'light', 'navy', 'emerald'].includes(saved)) {
        return saved;
      }
    }
    return 'dark';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      applyThemeToDocument(newTheme);
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode =
      theme === 'dark' ? 'light' : theme === 'light' ? 'navy' : theme === 'navy' ? 'emerald' : 'dark';
    setTheme(nextTheme);
  };

  const applyThemeToDocument = (themeMode: ThemeMode) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    
    // Toggle light / dark classes for external libraries if needed
    if (themeMode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  };

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const currentThemeOption =
    THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, currentThemeOption }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
