import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEME_OPTIONS, ThemeMode } from '../lib/theme/ThemeContext';
import { Sun, Moon, Compass, Leaf, Palette, Check, ChevronDown } from 'lucide-react';

interface ThemeSwitcherProps {
  variant?: 'compact' | 'dropdown' | 'drawer' | 'bar';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'dropdown',
  className = '',
}) => {
  const { theme, setTheme, toggleTheme, currentThemeOption } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = (iconName: string, iconClass = 'w-4 h-4') => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${iconClass} text-amber-500`} />;
      case 'compass':
        return <Compass className={`${iconClass} text-amber-400`} />;
      case 'leaf':
        return <Leaf className={`${iconClass} text-emerald-400`} />;
      case 'moon':
      default:
        return <Moon className={`${iconClass} text-[#f06a1d]`} />;
    }
  };

  // Drawer variant (vertical list for mobile drawer)
  if (variant === 'drawer') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-theme-muted px-1">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-theme-accent" />
            <span>Thème du site</span>
          </span>
          <span className="text-[10px] font-mono opacity-60">4 thèmes</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {THEME_OPTIONS.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-theme-accent bg-theme-accent/15 shadow-sm'
                    : 'border-theme-border bg-theme-surface/50 hover:bg-theme-surface text-theme-text'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20 shadow-inner flex items-center justify-center"
                  style={{ backgroundColor: opt.bgPreview }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: opt.accentColor }}
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold truncate leading-tight text-theme-text">
                    {opt.name}
                  </span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-theme-accent flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Compact toggle variant
  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`p-2 rounded-md border border-theme-border bg-theme-surface/80 hover:bg-theme-surface text-theme-text transition-all duration-200 cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent ${className}`}
        title={`Thème actuel : ${currentThemeOption.name} (cliquer pour changer)`}
        aria-label="Changer de thème"
      >
        {getThemeIcon(currentThemeOption.iconName)}
      </button>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-theme-border bg-theme-surface/80 hover:bg-theme-surface text-theme-text text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent"
        title="Changer le thème d'affichage"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          {getThemeIcon(currentThemeOption.iconName, 'w-3.5 h-3.5')}
          <span className="hidden sm:inline-block font-heading tracking-wide">
            {currentThemeOption.name}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-theme-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-theme-border bg-theme-card/95 backdrop-blur-xl shadow-2xl z-50 p-2 text-theme-text animate-fadeIn">
          <div className="px-2.5 py-1.5 border-b border-theme-border/60 mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-theme-accent" />
              Sélecteur de Thème
            </span>
          </div>

          <div className="space-y-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-150 cursor-pointer group ${
                    isSelected
                      ? 'bg-theme-accent/15 border border-theme-accent/30 text-theme-text'
                      : 'hover:bg-theme-surface text-theme-text/80 hover:text-theme-text border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Visual Color Chip */}
                    <div
                      className="w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center shadow-sm border border-white/20"
                      style={{ backgroundColor: opt.bgPreview }}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: opt.accentColor }}
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate leading-tight group-hover:text-theme-accent transition-colors">
                        {opt.name}
                      </span>
                      <span className="text-[10px] text-theme-muted truncate leading-tight mt-0.5">
                        {opt.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {getThemeIcon(opt.iconName, 'w-3.5 h-3.5')}
                    {isSelected && (
                      <Check className="w-4 h-4 text-theme-accent ml-1 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
