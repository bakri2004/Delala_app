import React from 'react';
import { Plus, Globe, UserPlus, UserCheck } from 'lucide-react';
import { ViewScreen, UserAccount } from '../types';

interface NavbarProps {
  currentView: ViewScreen;
  onNavigate: (view: ViewScreen) => void;
  isArabic: boolean;
  onToggleLanguage: () => void;
  listingCount: number;
  currentUser?: UserAccount | null;
  onOpenSignUp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isArabic,
  onToggleLanguage,
  listingCount,
  currentUser,
  onOpenSignUp,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-emerald-900/10 shadow-xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand / Wordmark */}
        <button
          id="nav-brand-btn"
          onClick={() => onNavigate('browse')}
          className="flex flex-col text-start focus:outline-hidden group cursor-pointer shrink"
        >
          <span className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight leading-tight group-hover:text-emerald-950 transition-colors font-['Tajawal',sans-serif]">
            {isArabic ? 'دلالة' : 'Dallala'}
          </span>
          <span className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5 max-w-[180px] sm:max-w-none line-clamp-1 sm:line-clamp-none">
            {isArabic
              ? 'بيع وشراء عربتك بسهولة وأمان، مباشرة من الناس'
              : 'Buy & sell your car easily and safely, directly from people'}
          </span>
        </button>

        {/* Actions (Language Toggle + Sign Up Button + Post Ad Button) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher */}
          <button
            id="nav-lang-toggle-btn"
            onClick={onToggleLanguage}
            title={isArabic ? 'Switch to English' : 'التحويل للعربية'}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs font-bold text-slate-700 hover:text-emerald-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors min-h-[38px] sm:min-h-[40px] cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800" />
            <span>{isArabic ? 'English' : 'عربي'}</span>
          </button>

          {/* Sign Up / Account Button */}
          <button
            id="nav-signup-btn"
            onClick={onOpenSignUp}
            title={currentUser ? (isArabic ? 'عرض حسابك' : 'View Account') : (isArabic ? 'إنشاء حساب جديد' : 'Sign up')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm border transition-all min-h-[38px] sm:min-h-[42px] cursor-pointer whitespace-nowrap ${
              currentUser
                ? 'border-emerald-800/30 bg-emerald-50 text-emerald-950 hover:bg-emerald-100'
                : 'border-emerald-800/25 bg-white text-emerald-900 hover:bg-emerald-50 active:scale-98 shadow-2xs'
            }`}
          >
            {currentUser ? (
              <>
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800 shrink-0" />
                <span className="max-w-[75px] sm:max-w-[120px] truncate">{currentUser.name}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800 shrink-0" />
                <span>{isArabic ? 'إنشاء حساب' : 'Sign up'}</span>
              </>
            )}
          </button>

          {/* Post an Ad button (Deep Green Accent) */}
          <button
            id="nav-post-ad-btn"
            onClick={() => onNavigate('post')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-base shadow-xs transition-all min-h-[38px] sm:min-h-[42px] cursor-pointer whitespace-nowrap ${
              currentView === 'post'
                ? 'bg-emerald-950 text-white ring-2 ring-emerald-800'
                : 'bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white'
            }`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] shrink-0" />
            <span>{isArabic ? 'أضف إعلانك' : 'Post Ad'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

