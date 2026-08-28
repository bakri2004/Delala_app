import React from 'react';
import { X } from 'lucide-react';

interface ModalCloseButtonProps {
  onClose: () => void;
  isArabic?: boolean;
  className?: string;
  id?: string;
}

/**
 * Standardized high-visibility close button for all modals, dropdowns, and superimposed overlays.
 * Consistently placed at the top-left corner in RTL layouts.
 */
export const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({
  onClose,
  isArabic = true,
  className = '',
  id,
}) => {
  return (
    <button
      id={id}
      type="button"
      onClick={onClose}
      className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 hover:text-slate-950 border border-slate-200/90 shadow-2xs transition-all cursor-pointer shrink-0 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 ${className}`}
      aria-label={isArabic ? 'إغلاق (X)' : 'Close (X)'}
      title={isArabic ? 'إغلاق النافذة (Esc)' : 'Close overlay (Esc)'}
    >
      <X className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
};
