import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Car,
  DollarSign,
  FileText,
  User,
  Sparkles,
  Calendar,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { VehicleListing, UserAccount } from '../types';
import { MAKES_LIST, SAMPLE_UPLOAD_PRESETS } from '../data/sampleListings';
import { formatArabicPriceInWords } from '../lib/formatters';
import { SelectorOverlayModal } from './SelectorOverlayModal';
import { getModelSuggestionsForMake, POPULAR_MODELS_BY_MAKE } from '../data/popularModels';

// Specific 12 Sudanese cities/states for post listing form
export const POST_FORM_CITIES = [
  'بورتسودان',
  'الخرطوم',
  'بحري',
  'أمدرمان',
  'كسلا',
  'القضارف',
  'الجزيرة',
  'نهر النيل',
  'الشمالية',
  'النيل الأبيض',
  'النيل الأزرق',
  'شمال كردفان',
];

interface PostListingScreenProps {
  onAddListing: (newListing: VehicleListing) => void;
  onCancel: () => void;
  isArabic: boolean;
  currentUser?: UserAccount | null;
}

export const PostListingScreen: React.FC<PostListingScreenProps> = ({
  onAddListing,
  onCancel,
  isArabic,
  currentUser,
}) => {
  // Form fields
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [make, setMake] = useState('تويوتا');
  const [model, setModel] = useState('كورولا');
  const [year, setYear] = useState<number>(2019);
  const [city, setCity] = useState(
    currentUser?.city && POST_FORM_CITIES.includes(currentUser.city)
      ? currentUser.city
      : 'بورتسودان'
  );
  const [locationDetails, setLocationDetails] = useState('');
  const [price, setPrice] = useState<string>('28000000');
  const [priceNegotiable, setPriceNegotiable] = useState(true);
  const [mileage, setMileage] = useState<string>('95000');
  const [transmission, setTransmission] = useState<VehicleListing['transmission']>('أوتوماتيك');
  const [fuelType, setFuelType] = useState<VehicleListing['fuelType']>('بنزين');
  const [description, setDescription] = useState(
    'سيارة نظيفة جداً وخالية من الصدمات. ماكينة وفحص ساري، تكييف شغال ثلاجة، كفرات جديدة. المعاينة في مكان عام للجادين فقط.'
  );
  const [sellerName, setSellerName] = useState(currentUser?.name || 'أحمد الفاتح');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '+249 91 888 7766');

  // Superimposed Overlay States for Make, Year, and City Selectors
  const [isMakeOverlayOpen, setIsMakeOverlayOpen] = useState(false);
  const [isYearOverlayOpen, setIsYearOverlayOpen] = useState(false);
  const [isCityOverlayOpen, setIsCityOverlayOpen] = useState(false);

  // Auto-suggestion state for Model input based on selected Make
  const [isModelSuggestionsOpen, setIsModelSuggestionsOpen] = useState(false);
  const modelContainerRef = useRef<HTMLDivElement>(null);

  // Filtered model suggestions based on selected make and user typed model
  const modelSuggestions = useMemo(() => {
    return getModelSuggestionsForMake(make, model);
  }, [make, model]);

  // Quick 1-tap model chips for currently selected make
  const popularChipsForMake = useMemo(() => {
    return (POPULAR_MODELS_BY_MAKE[make] || []).slice(0, 5);
  }, [make]);

  // Close suggestion dropdown when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (modelContainerRef.current && !modelContainerRef.current.contains(e.target as Node)) {
        setIsModelSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleSelectModelSuggestion = (suggestedModel: string) => {
    setModel(suggestedModel);
    setIsModelSuggestionsOpen(false);
  };

  const [errorMessage, setErrorMessage] = useState('');

  // Automatically infer body category from make and model for categorization without asking user
  const inferBodyType = (carModel: string, carMake: string): VehicleListing['bodyType'] => {
    const text = `${carMake} ${carModel}`.toLowerCase();
    if (text.includes('هايس') || text.includes('hiace') || text.includes('h100') || text.includes('شريحة') || text.includes('van') || text.includes('باص')) {
      return 'نقل ركاب (شريحة/هايس)';
    }
    if (text.includes('هايلوكس') || text.includes('hilux') || text.includes('بوكس') || text.includes('بيك اب') || text.includes('pickup') || text.includes('d-max') || text.includes('ديماكس')) {
      return 'بوكس / دبل كابين';
    }
    if (text.includes('دفار') || text.includes('شاحنة') || text.includes('truck') || text.includes('جامبو') || text.includes('canter') || text.includes('كانتر')) {
      return 'دفار / شاحنة';
    }
    if (text.includes('لاندكروزر') || text.includes('prado') || text.includes('برادو') || text.includes('توسان') || text.includes('tucson') || text.includes('sportage') || text.includes('سبورتاج') || text.includes('راف') || text.includes('rav4') || text.includes('فورشنر') || text.includes('fortuner') || text.includes('باترول') || text.includes('patrol')) {
      return 'دفع رباعي';
    }
    if (text.includes('يارس') || text.includes('yaris') || text.includes('i10') || text.includes('مورنينغ') || text.includes('morning') || text.includes('سويفت') || text.includes('swift') || text.includes('هاتشباك') || text.includes('كليك') || text.includes('click')) {
      return 'هاتشباك';
    }
    return 'سيدان';
  };

  // Auto-format price with commas and handle input
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Normalize Arabic digits and extract digits only
    let digits = e.target.value
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
      .replace(/\D/g, '');

    // Avoid multiple leading zeros
    if (digits.length > 1 && digits.startsWith('0')) {
      digits = digits.replace(/^0+/, '') || '0';
    }

    setPrice(digits.slice(0, 12));
  };

  const numericPrice = price ? parseInt(price, 10) : 0;
  const formattedPriceDisplay = price ? Number(price).toLocaleString('en-US') : '';
  const priceInWords = numericPrice > 0 ? formatArabicPriceInWords(numericPrice) : '';

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddSamplePhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!make || !model) {
      setErrorMessage(isArabic ? 'يرجى إدخال ماركة وموديل السيارة' : 'Please provide make and model');
      return;
    }

    const parsedPrice = parseInt(price.replace(/[^0-9]/g, ''), 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage(isArabic ? 'يرجى إدخال سعر صحيح بالجنيه السوداني' : 'Please enter a valid price in SDG');
      return;
    }

    if (!description.trim()) {
      setErrorMessage(isArabic ? 'يرجى كتابة وصف للسيارة لمساعدة المشترين' : 'Please write a description for buyers');
      return;
    }

    if (!sellerName.trim() || !sellerPhone.trim()) {
      setErrorMessage(isArabic ? 'يرجى إدخال اسمك ورقم الهاتف للتواصل' : 'Please provide your name and phone number');
      return;
    }

    const titleAr = `${make} ${model} ${year}`;
    const titleEn = `${make} ${model} ${year}`;
    const inferredBody = inferBodyType(model, make);

    const newListing: VehicleListing = {
      id: `user-car-${Date.now()}`,
      title: titleAr,
      titleEn: titleEn,
      make,
      model,
      year: Number(year),
      price: parsedPrice,
      priceNegotiable,
      city: city === 'الكل' ? 'بورتسودان' : city,
      cityEn: city === 'الكل' ? 'Port Sudan' : city,
      locationDetails: locationDetails || `${city} - السوق`,
      locationDetailsEn: locationDetails || `${city}`,
      mileage: parseInt(mileage.replace(/[^0-9]/g, ''), 10) || 0,
      transmission,
      fuelType,
      bodyType: inferredBody,
      bodyTypeEn: inferredBody,
      photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
      description: description.trim(),
      descriptionEn: description.trim(),
      seller: {
        name: sellerName.trim(),
        phone: sellerPhone.trim(),
        whatsapp: sellerPhone.trim(),
        isVerified: true,
        memberSince: '2024',
        city: city === 'الكل' ? 'بورتسودان' : city,
      },
      createdAt: isArabic ? 'الآن' : 'Just now',
      createdAtEn: 'Just now',
      viewsCount: 1,
    };

    onAddListing(newListing);
  };

  // Generate years list covering 1980 through the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1980 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-20">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {isArabic ? 'أضف إعلان سيارتك للبيع' : 'Post Your Vehicle for Sale'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          {isArabic
            ? 'خطوات بسيطة ومباشرة في أقل من دقيقة لنشر سيارتك أمام آلاف المشترين في السودان'
            : 'Simple and direct - post your vehicle in under a minute to reach thousands in Sudan'}
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. Photo Upload Section (Multiple) */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm sm:text-base font-bold text-slate-900">
              {isArabic ? '1. صور السيارة (أضف صورة واحدة أو أكثر):' : '1. Vehicle Photos (Add one or more):'}
            </label>
            <span className="text-xs text-slate-500 font-medium">
              {isArabic ? `${photos.length} صور مضافة` : `${photos.length} photos added`}
            </span>
          </div>

          {/* Photos Preview Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
            {photos.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs"
              >
                <img
                  src={url}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {idx === 0 && (
                  <span className="absolute top-1.5 start-1.5 bg-emerald-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {isArabic ? 'الرئيسية' : 'Cover'}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1.5 end-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full transition-colors cursor-pointer"
                  title="حذف الصورة"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            <label className="relative aspect-4/3 rounded-xl border-2 border-dashed border-emerald-700/40 hover:border-emerald-800 hover:bg-emerald-50/50 bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-slate-600 hover:text-emerald-900">
              <UploadCloud className="w-6 h-6 text-emerald-800" />
              <span className="text-[11px] sm:text-xs font-bold text-center px-1">
                {isArabic ? 'رفع من جهازك' : 'Upload photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Quick preset selector for instant prototyping */}
          <div className="pt-2">
            <p className="text-[11px] text-slate-500 font-semibold mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
              <span>{isArabic ? 'أو اختر صور تجريبية بنقرة واحدة:' : 'Or tap to add preset vehicle photos:'}</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_UPLOAD_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSamplePhoto(preset.url)}
                  className="text-xs bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-medium px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Structured Info (Make, Model, Year, Location) */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Car className="w-4 h-4 text-emerald-800" />
            <span>{isArabic ? '2. معلومات السيارة الأساسية:' : '2. Basic Vehicle Info:'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Make Selector Trigger */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isArabic ? 'الماركة (الشركة)' : 'Make'}
              </label>
              <button
                id="post-make-select-btn"
                type="button"
                onClick={() => setIsMakeOverlayOpen(true)}
                className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden transition-colors cursor-pointer text-start"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Car className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span className="truncate">{make}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* Model Free-Text Input with Dynamic Auto-Suggestions Based on Selected Make */}
            <div ref={modelContainerRef} className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {isArabic ? 'الموديل (النوع)' : 'Model'}
                </label>
                {make && (
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    {isArabic ? `اقتراحات لـ ${make}` : `Suggestions for ${make}`}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  id="post-model-input"
                  type="text"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    setIsModelSuggestionsOpen(true);
                  }}
                  onFocus={() => setIsModelSuggestionsOpen(true)}
                  placeholder={
                    isArabic
                      ? `اكتب اسم الموديل (مثال: ${popularChipsForMake[0]?.nameAr || 'كورولا'})`
                      : `e.g. ${popularChipsForMake[0]?.nameEn || 'Corolla'}`
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden transition-all"
                  autoComplete="off"
                  required
                />

                {model && (
                  <button
                    type="button"
                    onClick={() => {
                      setModel('');
                      setIsModelSuggestionsOpen(true);
                    }}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                    title={isArabic ? 'مسح' : 'Clear'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Floating Auto-Suggestions Dropdown (Appears as user types or focuses) */}
              {isModelSuggestionsOpen && modelSuggestions.length > 0 && (
                <div
                  id="model-suggestions-dropdown"
                  className="absolute z-30 start-0 end-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                    <span>
                      {isArabic
                        ? `موديلات مقترحة لـ ${make}:`
                        : `Suggested models for ${make}:`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {isArabic ? 'اضغط للاختيار' : 'Tap to select'}
                    </span>
                  </div>

                  {modelSuggestions.map((suggestion, idx) => {
                    const isSelected =
                      model.trim().toLowerCase() === suggestion.nameAr.toLowerCase() ||
                      model.trim().toLowerCase() === suggestion.nameEn.toLowerCase();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur before click registers
                          handleSelectModelSuggestion(isArabic ? suggestion.nameAr : suggestion.nameEn);
                        }}
                        className={`w-full px-3.5 py-2.5 text-start flex items-center justify-between text-xs sm:text-sm hover:bg-emerald-50 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-950 font-bold'
                            : 'text-slate-800 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{suggestion.nameAr}</span>
                          <span className="text-xs text-slate-400 font-normal">
                            ({suggestion.nameEn})
                          </span>
                        </div>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                            {isArabic ? 'اختيار' : 'Select'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quick 1-Tap Suggestion Chips for Selected Make */}
              {popularChipsForMake.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">
                    {isArabic ? 'شائع:' : 'Popular:'}
                  </span>
                  {popularChipsForMake.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectModelSuggestion(isArabic ? chip.nameAr : chip.nameEn)}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                        model === chip.nameAr || model === chip.nameEn
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isArabic ? chip.nameAr : chip.nameEn}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year Selector Trigger */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isArabic ? 'سنة الصنع (الموديل)' : 'Year of Manufacture'}
              </label>
              <button
                id="post-year-select-btn"
                type="button"
                onClick={() => setIsYearOverlayOpen(true)}
                className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden transition-colors cursor-pointer text-start"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>{year}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* City Selector Trigger */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isArabic ? 'المدينة / الولاية' : 'City / State'}
              </label>
              <button
                id="post-city-select-btn"
                type="button"
                onClick={() => setIsCityOverlayOpen(true)}
                className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden transition-colors cursor-pointer text-start"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span className="truncate">{city}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* Location Details (Neighborhood) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isArabic ? 'الحي / منطقة المعاينة (اختياري)' : 'Neighborhood / District'}
              </label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder={isArabic ? 'مثال: حي المطار، الثورة الحارة 15، السوق الشعبي' : 'e.g. Al Matar, Al-Thawra'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Quick Specs: Transmission, Fuel, Mileage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isArabic ? 'ناقل الحركة (القير)' : 'Transmission'}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['أوتوماتيك', 'عادي'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTransmission(type)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      transmission === type
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isArabic ? 'نوع الوقود' : 'Fuel Type'}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['بنزين', 'جاز (ديزل)'] as const).map((fuel) => (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => setFuelType(fuel)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      fuelType === fuel
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {fuel}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isArabic ? 'الممشى بالتقريب (كم)' : 'Mileage (km)'}
              </label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="95000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* 3. Price Section */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-800" />
            <span>{isArabic ? '3. السعر بالجنيه السوداني:' : '3. Price in Sudanese Pounds:'}</span>
          </h2>

          <div className="space-y-2.5">
            <div>
              <label
                htmlFor="post-price-input"
                className="block text-xs sm:text-sm font-bold text-slate-800 mb-1"
              >
                {isArabic
                  ? 'السعر بالجنيه السوداني (اكتب الرقم كاملاً، مثال: 28000000)'
                  : 'Price in Sudanese Pounds (Enter full amount, e.g. 28000000)'}
              </label>
              <div className="relative">
                <input
                  id="post-price-input"
                  type="text"
                  inputMode="numeric"
                  value={formattedPriceDisplay}
                  onChange={handlePriceChange}
                  placeholder={isArabic ? 'مثال: 28,000,000' : 'e.g. 28,000,000'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-4 pe-24 py-3 text-lg font-black text-emerald-950 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  required
                />
                <span className="absolute end-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-bold text-slate-500 pointer-events-none">
                  {isArabic ? 'جنيه سوداني' : 'SDG'}
                </span>
              </div>
            </div>

            {/* Live readout directly below converting the number into words in Arabic */}
            {numericPrice > 0 && (
              <div
                id="price-live-readout"
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 transition-all ${
                  numericPrice < 1000000
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black tracking-wide" dir="rtl">
                    {priceInWords}
                  </span>
                </div>
                {numericPrice < 1000000 ? (
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md inline-block">
                    {isArabic
                      ? 'تنبيه: المبلغ المدخل بالألف وليس بالمليون، تأكد من كتابة كافة الأصفار'
                      : 'Notice: Amount is in thousands, make sure all zeros are included'}
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-800">
                    {isArabic ? 'صيغة معتمدة ومطابقة للملايين' : 'Millions format verified'}
                  </span>
                )}
              </div>
            )}

            {/* Negotiable Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={priceNegotiable}
                onChange={(e) => setPriceNegotiable(e.target.checked)}
                className="w-4 h-4 rounded-sm text-emerald-800 focus:ring-emerald-700 border-slate-300"
              />
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                {isArabic ? 'السعر قابل للتفاوض البسيط للجادين' : 'Price is negotiable for serious buyers'}
              </span>
            </label>
          </div>
        </div>

        {/* 4. Free-Text Description (Haraj Style) */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-800" />
            <span>{isArabic ? '4. وصف السيارة بكلماتك الخاصة (حر):' : '4. Free-Text Description:'}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {isArabic
              ? 'اكتب تفاصيل سيارتك براحتك (حالة الماكينة، البودي، التكييف، الترخيص، سبب البيع، مكان المعاينة)...'
              : 'Describe the vehicle in your own words (engine condition, AC, registration status, viewing place)...'}
          </p>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm sm:text-base text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden font-medium leading-relaxed"
            placeholder={
              isArabic
                ? 'مثال: سيارة نظيفة بوهية شركة، مكنة فل بدون أي ملاحظات، تكييف شغال ثلاجة، فحص ساري، رخصة مؤمنة...'
                : 'Write your car details here in your own words...'
            }
            required
          />
        </div>

        {/* 5. Seller Contact Info */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-800" />
            <span>{isArabic ? '5. بيانات التواصل مع البائع:' : '5. Seller Contact Details:'}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isArabic ? 'الاسم' : 'Your Name'}
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder={isArabic ? 'مثال: عثمان الطيب' : 'e.g. Osman Al-Tayeb'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isArabic ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp Number'}
              </label>
              <input
                type="tel"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                placeholder="+249 9X XXX XXXX"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            id="post-submit-btn"
            type="submit"
            className="w-full sm:flex-1 py-3.5 px-6 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white font-bold text-base rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all min-h-[50px] cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isArabic ? 'نشر الإعلان الآن' : 'Publish Listing Now'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm sm:text-base rounded-xl transition-colors min-h-[50px] cursor-pointer"
          >
            {isArabic ? 'إلغاء والرجوع' : 'Cancel'}
          </button>
        </div>
      </form>

      {/* 1. Make Selector Overlay Modal with Top-Left X Close Button */}
      <SelectorOverlayModal
        id="make-selector"
        isOpen={isMakeOverlayOpen}
        onClose={() => setIsMakeOverlayOpen(false)}
        title={isArabic ? 'اختر ماركة السيارة (الشركة)' : 'Select Vehicle Make'}
        subtitle={isArabic ? 'اختر الشركة المصنعة' : 'Select manufacturer'}
        icon={<Car className="w-5 h-5 text-emerald-800" />}
        options={[
          { value: 'تويوتا', label: 'تويوتا', sublabel: 'Toyota' },
          { value: 'هيونداي', label: 'هيونداي', sublabel: 'Hyundai' },
          { value: 'ميتسوبيشي', label: 'ميتسوبيشي', sublabel: 'Mitsubishi' },
          { value: 'نيسان', label: 'نيسان', sublabel: 'Nissan' },
          { value: 'كيا', label: 'كيا', sublabel: 'Kia' },
          { value: 'سوزوكي', label: 'سوزوكي', sublabel: 'Suzuki' },
          { value: 'إيسوزو', label: 'إيسوزو', sublabel: 'Isuzu' },
          { value: 'مرسيدس بنز', label: 'مرسيدس بنز', sublabel: 'Mercedes-Benz' },
          { value: 'بي إم دبليو', label: 'بي إم دبليو', sublabel: 'BMW' },
          { value: 'هوندا', label: 'هوندا', sublabel: 'Honda' },
          { value: 'فورد', label: 'فورد', sublabel: 'Ford' },
          { value: 'شيفروليه', label: 'شيفروليه', sublabel: 'Chevrolet' },
          { value: 'جيلي', label: 'جيلي', sublabel: 'Geely' },
          { value: 'إم جي', label: 'إم جي', sublabel: 'MG' },
          { value: 'شيري', label: 'شيري', sublabel: 'Chery' },
          { value: 'بي واي دي', label: 'بي واي دي', sublabel: 'BYD' },
          { value: 'شانجان', label: 'شانجان', sublabel: 'Changan' },
          { value: 'هافال', label: 'هافال', sublabel: 'Haval' },
          { value: 'لاند روفر', label: 'لاند روفر', sublabel: 'Land Rover' },
          { value: 'أخرى', label: 'أخرى (ماركة غير مدرجة)', sublabel: 'Other' },
        ]}
        selectedValue={make}
        onSelect={(val) => {
          setMake(val);
          setIsModelSuggestionsOpen(true);
        }}
        isArabic={isArabic}
        searchPlaceholder={isArabic ? 'ابحث باسم الماركة (مثال: تويوتا، هيونداي)...' : 'Search makes...'}
        columns={2}
      />

      {/* 2. Year Selector Overlay Modal with Top-Left X Close Button (1980 - 2026) */}
      <SelectorOverlayModal
        id="year-selector"
        isOpen={isYearOverlayOpen}
        onClose={() => setIsYearOverlayOpen(false)}
        title={isArabic ? 'اختر سنة الصنع (الموديل)' : 'Select Year of Manufacture'}
        subtitle={isArabic ? `السنوات من 1980 حتى ${currentYear}` : `Years 1980 through ${currentYear}`}
        icon={<Calendar className="w-5 h-5 text-emerald-800" />}
        options={years.map((y) => ({
          value: y,
          label: String(y),
        }))}
        selectedValue={year}
        onSelect={(val) => setYear(Number(val))}
        isArabic={isArabic}
        searchPlaceholder={isArabic ? 'ابحث عن السنة (مثال: 2018، 2005، 1998)...' : 'Search year...'}
        columns={4}
      />

      {/* 3. City/State Selector Overlay Modal with Top-Left X Close Button (12 Sudanese Cities) */}
      <SelectorOverlayModal
        id="city-selector"
        isOpen={isCityOverlayOpen}
        onClose={() => setIsCityOverlayOpen(false)}
        title={isArabic ? 'اختر المدينة / الولاية' : 'Select City / State'}
        subtitle={isArabic ? 'الولايات والمدن الرئيسية في السودان' : 'Main cities & states in Sudan'}
        icon={<MapPin className="w-5 h-5 text-emerald-800" />}
        options={POST_FORM_CITIES.map((c) => ({
          value: c,
          label: c,
        }))}
        selectedValue={city}
        onSelect={(val) => setCity(val)}
        isArabic={isArabic}
        searchPlaceholder={isArabic ? 'ابحث عن المدينة (مثال: بورتسودان، الخرطوم)...' : 'Search city...'}
        columns={2}
      />
    </div>
  );
};
