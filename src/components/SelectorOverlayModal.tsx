import React, { useState, useEffect, useMemo } from 'react';
import { Search, Check, X } from 'lucide-react';
import { ModalCloseButton } from './ModalCloseButton';

export interface SelectorOption {
  value: string | number;
  label: string;
  sublabel?: string;
  badge?: string;
}

interface SelectorOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  options: SelectorOption[];
  selectedValue: string | number;
  onSelect: (value: any) => void;
  isArabic: boolean;
  searchPlaceholder?: string;
  columns?: 1 | 2 | 3 | 4;
  id?: string;
}

export const SelectorOverlayModal: React.FC<SelectorOverlayModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  options,
  selectedValue,
  onSelect,
  isArabic,
  searchPlaceholder,
  columns = 1,
  id = 'selector',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Reset search when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        String(opt.value).toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  if (!isOpen) return null;

  const handlePick = (val: string | number) => {
    onSelect(val);
    onClose();
  };

  const gridColsClass =
    columns === 4
      ? 'grid-cols-3 sm:grid-cols-4'
      : columns === 3
      ? 'grid-cols-2 sm:grid-cols-3'
      : columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1';

  return (
    <div
      id={`${id}-overlay-backdrop`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id={`${id}-overlay-container`}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] text-slate-800 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header - Top Right: Title/Icon, Top Left: Standardized X Close Button */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-850 flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Clearly visible X close button in top-left corner */}
          <ModalCloseButton
            id={`close-${id}-btn`}
            onClose={onClose}
            isArabic={isArabic}
          />
        </div>

        {/* Search Field (if more than 6 options) */}
        {options.length > 6 && (
          <div className="p-3 sm:p-4 border-b border-slate-100 bg-white">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-emerald-800 absolute start-3 pointer-events-none stroke-[2.2]" />
              <input
                id={`${id}-search-input`}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchPlaceholder ||
                  (isArabic ? 'ابحث في الخيارات...' : 'Search options...')
                }
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl ps-9 pe-8 py-2.5 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-medium transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-2.5 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Options List / Grid */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 overscroll-contain">
          {filteredOptions.length > 0 ? (
            <div className={`grid ${gridColsClass} gap-2`}>
              {filteredOptions.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => handlePick(option.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-start transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-1 ring-emerald-500/30'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-800 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs sm:text-sm truncate">
                        {option.label}
                      </span>
                      {option.sublabel && (
                        <span className="text-[11px] text-slate-400 font-normal truncate">
                          {option.sublabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ms-2">
                      {option.badge && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-bold">
                          {option.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 space-y-1">
              <p className="text-xs sm:text-sm font-semibold">
                {isArabic ? 'لا توجد نتائج مطابقة' : 'No matching results'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isArabic ? 'جرب البحث بكلمة أخرى' : 'Try another keyword'}
              </p>
            </div>
          )}
        </div>

        {/* Footer info banner (Cancel button removed, closing handled by distinct top X button) */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-center text-[11px] text-slate-400 font-medium">
          <span>
            {isArabic
              ? `${filteredOptions.length} خيار متوفر`
              : `${filteredOptions.length} options`}
          </span>
        </div>
      </div>
    </div>
  );
};
