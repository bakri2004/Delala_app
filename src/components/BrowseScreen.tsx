import React, { useState, useMemo } from 'react';
import { Search, X, MapPin, AlertCircle, ChevronDown } from 'lucide-react';
import { VehicleListing } from '../types';
import { ListingCard } from './ListingCard';
import { CITIES_SUDAN } from '../data/sampleListings';
import { POST_FORM_CITIES } from './PostListingScreen';
import { SelectorOverlayModal } from './SelectorOverlayModal';

interface BrowseScreenProps {
  listings: VehicleListing[];
  onSelectListing: (listing: VehicleListing) => void;
  isArabic: boolean;
  onNavigateToPost: () => void;
}

export const BrowseScreen: React.FC<BrowseScreenProps> = ({
  listings,
  onSelectListing,
  isArabic,
  onNavigateToPost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('الكل');
  const [selectedCity, setSelectedCity] = useState('الكل');
  const [selectedBodyType, setSelectedBodyType] = useState('الكل');
  const [pricePreset, setPricePreset] = useState<'all' | 'under15' | '15to25' | '25to40' | 'above40'>('all');

  // Superimposed Overlay State for City Selector
  const [isCityOverlayOpen, setIsCityOverlayOpen] = useState(false);

  // Quick Filter Categories (Sudanese favorite vehicle types and makes)
  const quickCategories = useMemo(() => [
    { id: 'all', labelAr: 'جميع الأنواع', labelEn: 'All Types', make: 'الكل', body: 'الكل' },
    { id: 'toyota', labelAr: 'تويوتا (Toyota)', labelEn: 'Toyota', make: 'تويوتا', body: 'الكل' },
    { id: 'hyundai', labelAr: 'هيونداي (Hyundai)', labelEn: 'Hyundai', make: 'هيونداي', body: 'الكل' },
    { id: 'mitsubishi', labelAr: 'ميتسوبيشي (Mitsubishi)', labelEn: 'Mitsubishi', make: 'ميتسوبيشي', body: 'الكل' },
    { id: 'nissan', labelAr: 'نيسان (Nissan)', labelEn: 'Nissan', make: 'نيسان', body: 'الكل' },
    { id: 'kia', labelAr: 'كيا (Kia)', labelEn: 'Kia', make: 'كيا', body: 'الكل' },
    { id: 'public_trans', labelAr: 'شرايح وباصات ركاب', labelEn: 'Minibuses / HiAce', make: 'الكل', body: 'نقل ركاب (شريحة/هايس)' },
    { id: 'trucks', labelAr: 'بوكسات ودفارات', labelEn: 'Pickups & Box', make: 'الكل', body: 'بوكس / دبل كابين' },
    { id: 'sedan', labelAr: 'سيدان صالون', labelEn: 'Sedans', make: 'الكل', body: 'سيدان' },
    { id: 'suv', labelAr: 'دفع رباعي (4x4)', labelEn: '4x4 SUVs', make: 'الكل', body: 'دفع رباعي' },
  ], []);

  // Preset price change handler
  const handlePricePresetChange = (preset: 'all' | 'under15' | '15to25' | '25to40' | 'above40') => {
    setPricePreset(preset);
  };

  // Filter logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Search text match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesAr =
          item.title.toLowerCase().includes(query) ||
          item.make.toLowerCase().includes(query) ||
          item.model.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.year.toString().includes(query);
        const matchesEn =
          item.titleEn.toLowerCase().includes(query) ||
          item.cityEn.toLowerCase().includes(query) ||
          item.descriptionEn.toLowerCase().includes(query);

        if (!matchesAr && !matchesEn) return false;
      }

      // City match (One tap direct filter)
      if (selectedCity !== 'الكل' && item.city !== selectedCity) {
        return false;
      }

      // Make match
      if (selectedMake !== 'الكل') {
        if (selectedMake === 'أخرى') {
          const topMakes = ['تويوتا', 'هيونداي', 'ميتسوبيشي', 'نيسان', 'كيا', 'سوزوكي', 'إيسوزو'];
          if (topMakes.includes(item.make)) return false;
        } else if (item.make !== selectedMake) {
          return false;
        }
      }

      // Body Type match
      if (selectedBodyType !== 'الكل' && item.bodyType !== selectedBodyType) {
        return false;
      }

      // Price preset match
      if (pricePreset === 'under15' && item.price >= 15000000) return false;
      if (pricePreset === '15to25' && (item.price < 15000000 || item.price > 25000000)) return false;
      if (pricePreset === '25to40' && (item.price < 25000000 || item.price > 40000000)) return false;
      if (pricePreset === 'above40' && item.price <= 40000000) return false;

      return true;
    });
  }, [listings, searchQuery, selectedCity, selectedMake, selectedBodyType, pricePreset]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('الكل');
    setSelectedMake('الكل');
    setSelectedBodyType('الكل');
    setPricePreset('all');
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-5 space-y-3 sm:space-y-5">
      
      {/* 1. Location Filter - Immediately Visible Right Under the Header (Requirement #3) */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs sm:text-sm">
            <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>{isArabic ? 'المدينة / الولاية:' : 'City / Location:'}</span>
            {selectedCity !== 'الكل' && (
              <span className="bg-emerald-100 text-emerald-900 text-xs px-2 py-0.5 rounded-full font-bold">
                {selectedCity}
              </span>
            )}
          </div>
        </div>

        {/* Horizontal Quick-Select City Buttons (One-Tap Filtering) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CITIES_SUDAN.map((city) => {
            const isSelected = selectedCity === city;
            const label = city === 'الكل' ? (isArabic ? 'كل المدن' : 'All Cities') : city;
            return (
              <button
                key={city}
                id={`city-filter-${city}`}
                onClick={() => setSelectedCity(city)}
                className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[38px] cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-800/20'
                    : 'bg-slate-100 hover:bg-slate-200/90 text-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
          {/* Button to open Superimposed City Selector Overlay Modal with top-left X button */}
          <button
            id="browse-city-overlay-btn"
            type="button"
            onClick={() => setIsCityOverlayOpen(true)}
            className="whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-800/20 flex items-center gap-1.5 transition-all min-h-[38px] cursor-pointer shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-800" />
            <span>{isArabic ? 'اختر ولاية / مدينة...' : 'Choose City...'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-800" />
          </button>
        </div>
      </div>

      {/* 2. Main Search & Filters Card */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-xs space-y-3.5">
        {/* Large Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-emerald-800 absolute start-3.5 pointer-events-none stroke-[2.2]" />
          <input
            id="browse-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isArabic
                ? 'ابحث باسم السيارة، الموديل (مثلاً: كورولا، أكسنت، هايلوكس، شريحة)...'
                : 'Search car make or model (e.g. Corolla, Accent, Hilux, HiAce)...'
            }
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm sm:text-base rounded-xl ps-11 pe-10 py-3 sm:py-3.5 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-3 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Vehicle Make & Type Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickCategories.map((cat) => {
            const isActive =
              cat.id === 'all'
                ? selectedMake === 'الكل' && selectedBodyType === 'الكل'
                : selectedMake === cat.make || (cat.make === 'الكل' && selectedBodyType === cat.body);

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'all') {
                    setSelectedMake('الكل');
                    setSelectedBodyType('الكل');
                  } else {
                    setSelectedMake(cat.make);
                    setSelectedBodyType(cat.body);
                  }
                }}
                className={`whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[36px] cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-950 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {isArabic ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* 3. Price Range Filter (Requirement #4 - Easily Accessible & Not Buried) */}
        <div className="pt-2.5 border-t border-slate-100 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>{isArabic ? 'نطاق السعر (بالمليون جنيه سوداني):' : 'Price Range (Million SDG):'}</span>
            </span>

            {/* Quick Price Preset Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <button
                onClick={() => handlePricePresetChange('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  pricePreset === 'all'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isArabic ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => handlePricePresetChange('under15')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  pricePreset === 'under15'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isArabic ? 'أقل من 15م' : '< 15M'}
              </button>
              <button
                onClick={() => handlePricePresetChange('15to25')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  pricePreset === '15to25'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isArabic ? '15 - 25م' : '15-25M'}
              </button>
              <button
                onClick={() => handlePricePresetChange('25to40')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  pricePreset === '25to40'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isArabic ? '25 - 40م' : '25-40M'}
              </button>
              <button
                onClick={() => handlePricePresetChange('above40')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  pricePreset === 'above40'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isArabic ? 'أكثر من 40م' : '> 40M'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid of Listing Cards (Requirement #1) */}
      {filteredListings.length > 0 ? (
        <div
          id="browse-listings-grid"
          className="grid grid-cols-2 gap-3 sm:gap-5"
        >
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onSelect={onSelectListing}
              isArabic={isArabic}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            {isArabic ? 'لم نجد سيارات مطابقة لخيارات البحث' : 'No vehicles found matching your criteria'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {isArabic
              ? 'جرب اختيار مدينة أخرى أو تغيير نطاق السعر لعرض السيارات المتوفرة.'
              : 'Try selecting another city or broadening your price range.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
            >
              {isArabic ? 'عرض كل السيارات' : 'Show all cars'}
            </button>
            <button
              onClick={onNavigateToPost}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
            >
              {isArabic ? 'أضف سيارتك للبيع +' : 'Post a vehicle for sale +'}
            </button>
          </div>
        </div>
      )}

      {/* City Selector Overlay Modal with Top-Left X Close Button */}
      <SelectorOverlayModal
        id="browse-city-selector"
        isOpen={isCityOverlayOpen}
        onClose={() => setIsCityOverlayOpen(false)}
        title={isArabic ? 'اختر المدينة / الولاية' : 'Select City / State'}
        subtitle={isArabic ? 'الولايات والمدن الرئيسية في السودان' : 'Main cities & states in Sudan'}
        icon={<MapPin className="w-5 h-5 text-emerald-800" />}
        options={[
          { value: 'الكل', label: isArabic ? 'كل مدن السودان' : 'All Sudan Cities' },
          ...POST_FORM_CITIES.map((c) => ({
            value: c,
            label: c,
          })),
        ]}
        selectedValue={selectedCity}
        onSelect={(val) => setSelectedCity(val)}
        isArabic={isArabic}
        searchPlaceholder={isArabic ? 'ابحث عن المدينة (مثال: بورتسودان، الخرطوم)...' : 'Search city...'}
        columns={2}
      />
    </div>
  );
};
