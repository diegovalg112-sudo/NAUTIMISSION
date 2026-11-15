import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { LANGUAGE_OPTIONS, type AppLang } from '../locales';
import { UI_STRINGS } from '../data/uiStrings';
import { CountryFlagIcon } from './CountryFlagIcon';

interface LanguageSelectorProps {
  value: AppLang;
  onChange: (lang: AppLang) => void;
  variant?: 'default' | 'compact' | 'hud';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  variant = 'default',
  className = '',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const ariaLabel = UI_STRINGS[value].languageSelectorAria;
  const activeOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === value) ?? LANGUAGE_OPTIONS[0];

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('pointerdown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('pointerdown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  if (variant === 'hud') {
    return (
      <div ref={containerRef} className={`relative flex-none ${className}`}>
        {/* Wide screens (xl+): full 3-button inline kawaii selector with SVG flags + language names */}
        <div
          className="hidden items-center gap-0.5 rounded-xl border-2 border-[#00d2e0]/55 bg-[#061634]/95 p-0.5 text-[11px] font-black shadow-[0_2px_0_#041029] xl:flex"
          role="group"
          aria-label={ariaLabel}
        >
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = value === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => onChange(opt.code)}
                aria-pressed={active}
                aria-label={opt.accessibleLabel}
                title={opt.accessibleLabel}
                className={`flex min-h-[30px] items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-0.5 transition active:scale-95 ${
                  active
                    ? 'bg-[#00d2e0] text-[#08265b] shadow-[0_0_10px_rgba(0,210,224,0.4)]'
                    : 'text-[#9df8ff] hover:bg-[#0d2a63] hover:text-white'
                }`}
              >
                <CountryFlagIcon lang={opt.code} className="h-3 w-[18px]" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tablet & mobile landscape (<xl): keeps active flag + language name visible without overflowing HUD, opens roomy 3-option menu */}
        <div className="xl:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="listbox"
            aria-label={`${ariaLabel}: ${activeOption.accessibleLabel}`}
            className={`flex min-h-[36px] items-center gap-1.5 rounded-xl border-2 px-2 py-1 text-[11px] font-black shadow-[0_2px_0_#041029] transition active:scale-95 sm:px-2.5 ${
              menuOpen
                ? 'border-[#fde047] bg-[#facc15] text-[#08265b]'
                : 'border-[#00d2e0]/70 bg-[#0c2e70]/95 text-[#e6faff] hover:bg-[#13429b]'
            }`}
          >
            <CountryFlagIcon
              lang={activeOption.code}
              className="h-3.5 w-5"
            />
            <span className="whitespace-nowrap">{activeOption.label}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 flex-none transition-transform duration-150 ${
                menuOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {menuOpen && (
            <div
              role="listbox"
              aria-label={ariaLabel}
              className="absolute top-[calc(100%+6px)] right-0 z-50 min-w-[178px] rounded-2xl border-2 border-white bg-[#08265b]/98 p-1.5 shadow-[0_8px_22px_rgba(4,16,41,0.8)] backdrop-blur-md"
            >
              <div className="flex flex-col gap-1">
                {LANGUAGE_OPTIONS.map((opt) => {
                  const active = value === opt.code;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      role="option"
                      aria-selected={active}
                      aria-label={opt.accessibleLabel}
                      onClick={() => {
                        onChange(opt.code);
                        setMenuOpen(false);
                      }}
                      className={`flex min-h-[40px] w-full items-center justify-between gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-xs font-black transition active:scale-[0.98] ${
                        active
                          ? 'bg-[#00d2e0] text-[#08265b] shadow-[0_0_10px_rgba(0,210,224,0.35)]'
                          : 'bg-[#061634]/75 text-[#d9f7ff] hover:bg-[#13429b] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CountryFlagIcon
                          lang={opt.code}
                          className="h-3.5 w-5"
                        />
                        <span className="whitespace-nowrap">{opt.label}</span>
                      </span>
                      {active && (
                        <Check
                          className="h-3.5 w-3.5 flex-none text-[#08265b]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const buttonClasses =
    variant === 'compact'
      ? 'min-h-[30px] gap-1.5 px-2 py-0.5 text-[10px] sm:text-[11px]'
      : 'min-h-[34px] gap-1.5 px-2 py-1 text-[11px] sm:px-2.5 sm:text-xs';

  const flagSizeClass =
    variant === 'compact' ? 'h-3 w-[18px]' : 'h-3.5 w-5';

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-0.5 rounded-xl border-2 border-[#00d2e0]/50 bg-[#07183d]/90 p-0.5 font-black shadow-[0_2px_0_#041029] backdrop-blur-sm ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {LANGUAGE_OPTIONS.map((opt) => {
        const active = value === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => onChange(opt.code)}
            aria-pressed={active}
            aria-label={opt.accessibleLabel}
            title={opt.accessibleLabel}
            className={`flex items-center whitespace-nowrap rounded-lg transition active:scale-95 ${buttonClasses} ${
              active
                ? 'bg-[#00d2e0] text-[#08265b] shadow-[0_0_10px_rgba(0,210,224,0.4)]'
                : 'text-[#9df8ff] hover:bg-[#0d2a63] hover:text-white'
            }`}
          >
            <CountryFlagIcon lang={opt.code} className={flagSizeClass} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
