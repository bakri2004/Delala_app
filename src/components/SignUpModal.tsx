import React, { useState, useEffect } from 'react';
import { UserPlus, LogIn, User, Phone, MapPin, Building2, CheckCircle2, AlertCircle, LogOut, ChevronDown } from 'lucide-react';
import { UserAccount } from '../types';
import { CITIES_SUDAN } from '../data/sampleListings';
import { ModalCloseButton } from './ModalCloseButton';
import { SelectorOverlayModal } from './SelectorOverlayModal';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  currentUser: UserAccount | null;
  onSignUpSuccess: (account: UserAccount) => void;
  onSignOut: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  currentUser,
  onSignUpSuccess,
  onSignOut,
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('بورتسودان');
  const [accountType, setAccountType] = useState<'individual' | 'dealer'>('individual');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCityOverlayOpen, setIsCityOverlayOpen] = useState(false);

  // Clean cities list (exclude 'الكل')
  const availableCities = CITIES_SUDAN.filter((c) => c !== 'الكل');

  useEffect(() => {
    if (isOpen) {
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setError(isArabic ? 'يرجى إدخال اسمك الكريم بالكامل' : 'Please enter your full name');
        return;
      }
      if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
        setError(isArabic ? 'يرجى إدخال رقم هاتف سوداني صحيح (مثلاً: 0912345678)' : 'Please enter a valid Sudan phone number');
        return;
      }

      const formattedPhone = phone.trim().startsWith('+249')
        ? phone.trim()
        : `+249 ${phone.trim().replace(/^0+/, '')}`;

      const newAccount: UserAccount = {
        name: name.trim(),
        phone: formattedPhone,
        city,
        accountType,
        password,
        createdAt: new Date().toLocaleDateString(isArabic ? 'ar-SD' : 'en-US'),
      };

      onSignUpSuccess(newAccount);
      onClose();
    } else {
      // Login mode
      if (!phone.trim()) {
        setError(isArabic ? 'يرجى إدخال رقم هاتفك المسجل' : 'Please enter your registered phone number');
        return;
      }

      const formattedPhone = phone.trim().startsWith('+249')
        ? phone.trim()
        : `+249 ${phone.trim().replace(/^0+/, '')}`;

      const loggedAccount: UserAccount = {
        name: name.trim() || (isArabic ? 'صاحب الحساب' : 'Account Owner'),
        phone: formattedPhone,
        city,
        accountType,
        createdAt: new Date().toLocaleDateString(isArabic ? 'ar-SD' : 'en-US'),
      };

      onSignUpSuccess(loggedAccount);
      onClose();
    }
  };

  return (
    <div
      id="signup-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="signup-modal-container"
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-slate-800 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              {currentUser ? (
                <User className="w-5 h-5" />
              ) : mode === 'signup' ? (
                <UserPlus className="w-5 h-5" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {currentUser
                  ? isArabic
                    ? 'حسابك في دلالة'
                    : 'Your Dallala Account'
                  : mode === 'signup'
                  ? isArabic
                    ? 'إنشاء حساب جديد'
                    : 'Create New Account'
                  : isArabic
                  ? 'تسجيل الدخول'
                  : 'Sign In'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                {currentUser
                  ? isArabic
                    ? 'بيانات الحساب الشخصي'
                    : 'Personal Account Profile'
                  : isArabic
                  ? 'منصة دلالة لسوق السيارات في السودان'
                  : 'Dallala Vehicle Marketplace Sudan'}
              </p>
            </div>
          </div>
          <ModalCloseButton
            id="close-signup-modal-btn"
            onClose={onClose}
            isArabic={isArabic}
          />
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {currentUser ? (
            /* Logged in Account View */
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 space-y-3 text-start">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase">
                    {currentUser.accountType === 'dealer'
                      ? isArabic
                        ? 'معرض سيارات / وسيط'
                        : 'Car Dealer / Broker'
                      : isArabic
                      ? 'حساب شخصي (فـرد)'
                      : 'Individual Seller'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isArabic ? 'مُسجل' : 'Active'}
                  </span>
                </div>
                <div className="pt-1">
                  <div className="text-lg font-black text-emerald-950">{currentUser.name}</div>
                  <div className="text-xs text-slate-600 font-mono mt-0.5">{currentUser.phone}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1 border-t border-emerald-200/60">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{currentUser.city}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed text-start">
                {isArabic
                  ? 'عند إضافة إعلانات جديدة، سيتم استخدام اسمك ورقم هاتفك تلقائياً لتسهيل التواصل مع المشترين عبر الاتصال والواتساب.'
                  : 'When posting new listings, your name and phone will automatically populate to make buyer contact easy.'}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="signout-account-btn"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isArabic ? 'تسجيل الخروج من الحساب' : 'Sign Out of Account'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            /* Sign Up / Login Form */
            <form onSubmit={handleSubmit} className="space-y-3.5 text-start">
              {/* Optional Reminder Banner */}
              <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3 text-[11px] sm:text-xs text-emerald-900 leading-relaxed">
                {isArabic ? (
                  <span>
                    💡 <strong>ملاحظة:</strong> إنشاء الحساب اختياري بالكامل. يمكنك نشر إعلانات سيارتك والاتصال بالبائعين مباشرة في أي وقت بدون اشتراط إنشاء حساب.
                  </span>
                ) : (
                  <span>
                    💡 <strong>Note:</strong> Signing up is completely optional. You can always post listings and contact sellers directly without an account.
                  </span>
                )}
              </div>

              {/* Mode switch tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  className={`flex-1 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isArabic ? 'إنشاء حساب جديد' : 'Sign Up'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className={`flex-1 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isArabic ? 'تسجيل الدخول' : 'Log In'}
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name (for sign up or optional login) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isArabic ? 'الاسم بالكامل:' : 'Full Name:'}
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute start-3 pointer-events-none" />
                  <input
                    type="text"
                    required={mode === 'signup'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isArabic ? 'مثال: محمد عثمان بابكر' : 'e.g. Mohamed Osman'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-9 pe-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isArabic ? 'رقم الهاتف / الواتساب في السودان:' : 'Sudan Phone / WhatsApp:'}
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute start-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isArabic ? '0912345678 أو 0123456789' : '0912345678'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-9 pe-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* City (for sign up) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isArabic ? 'المدينة / الولاية:' : 'City / Location:'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCityOverlayOpen(true)}
                    className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span>{city}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}

              {/* Account Type (for sign up) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isArabic ? 'نوع الحساب:' : 'Account Type:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('individual')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        accountType === 'individual'
                          ? 'border-emerald-800 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'بائع شخصي (فـرد)' : 'Individual'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('dealer')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        accountType === 'dealer'
                          ? 'border-emerald-800 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'معرض / وسيط' : 'Dealer / Broker'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Password / PIN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isArabic ? 'كلمة المرور (اختيارية للرمز السريع):' : 'Password / PIN (optional):'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  id="submit-signup-form-btn"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-98 shadow-xs transition-all cursor-pointer min-h-[44px]"
                >
                  {mode === 'signup' ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>{isArabic ? 'إنشاء حساب جديد' : 'Create Account'}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{isArabic ? 'تسجيل الدخول' : 'Sign In'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Superimposed City Selector Overlay Modal with Top-Left X Close Button */}
      <SelectorOverlayModal
        isOpen={isCityOverlayOpen}
        onClose={() => setIsCityOverlayOpen(false)}
        title={isArabic ? 'اختر المدينة / الولاية' : 'Select City / Location'}
        subtitle={isArabic ? 'المدن والولايات المتاحة' : 'Available cities & states'}
        icon={<MapPin className="w-5 h-5 text-emerald-800" />}
        options={availableCities.map((c) => ({
          value: c,
          label: c,
        }))}
        selectedValue={city}
        onSelect={(selected) => setCity(selected)}
        isArabic={isArabic}
        columns={2}
        id="signup-city"
      />
    </div>
  );
};
