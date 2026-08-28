import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  CarFront,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { VehicleListing } from '../types';
import { formatPriceSDG, formatMileage, getWhatsAppUrl } from '../lib/formatters';
import { PhotoZoomModal } from './PhotoZoomModal';
import { MessageSellerModal } from './MessageSellerModal';

interface ListingDetailScreenProps {
  listing: VehicleListing;
  onBack: () => void;
  isArabic: boolean;
}

export const ListingDetailScreen: React.FC<ListingDetailScreenProps> = ({
  listing,
  onBack,
  isArabic,
}) => {
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos
    : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'];

  const nextPhoto = () => {
    setCurrentPhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const prevPhoto = () => {
    setCurrentPhotoIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  // Swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (isArabic) {
      // In RTL, swipe left goes to next, swipe right goes to prev
      if (distance > minSwipeDistance) {
        prevPhoto();
      } else if (distance < -minSwipeDistance) {
        nextPhoto();
      }
    } else {
      if (distance > minSwipeDistance) {
        nextPhoto();
      } else if (distance < -minSwipeDistance) {
        prevPhoto();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: isArabic ? listing.title : listing.titleEn,
          text: `${isArabic ? listing.title : listing.titleEn} - ${formatPriceSDG(listing.price, isArabic)}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const whatsappUrl = getWhatsAppUrl(
    listing.seller.whatsapp || listing.seller.phone,
    isArabic ? listing.title : listing.titleEn,
    listing.price,
    isArabic
  );

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-4 pb-28">
      {/* Top Navigation Bar: Back & Actions */}
      <div className="flex items-center justify-between gap-2">
        <button
          id="detail-back-btn"
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-98 border border-emerald-800 rounded-xl shadow-xs transition-all min-h-[40px] cursor-pointer"
        >
          {isArabic ? <ArrowRight className="w-4 h-4 text-emerald-100" /> : <ArrowLeft className="w-4 h-4 text-emerald-100" />}
          <span>{isArabic ? 'الرجوع للقائمة' : 'Back to listings'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            title={isArabic ? 'مشاركة الإعلان' : 'Share listing'}
            className="p-2 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {/* Save / Favorite */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            title={isArabic ? 'حفظ الإعلان' : 'Save'}
            className={`p-2 border border-slate-200 rounded-xl transition-colors cursor-pointer ${
              isSaved ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600' : ''}`} />
          </button>
        </div>
      </div>

      {showShareToast && (
        <div className="fixed top-16 start-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isArabic ? 'تم نسخ رابط الإعلان بنجاح!' : 'Link copied to clipboard!'}</span>
        </div>
      )}

      {/* 1. Swipeable Photo Gallery at the very top */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div
          className="relative aspect-4/3 sm:aspect-16/10 w-full bg-slate-900 overflow-hidden select-none cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsZoomOpen(true)}
        >
          <img
            src={photos[currentPhotoIdx]}
            alt={`${listing.title} - photo ${currentPhotoIdx + 1}`}
            className="w-full h-full object-contain sm:object-cover transition-opacity duration-200"
            referrerPolicy="no-referrer"
          />

          {/* Photo Counter Badge */}
          <div className="absolute bottom-3 start-3 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
            <span>
              {currentPhotoIdx + 1} / {photos.length}
            </span>
          </div>

          {/* Zoom hint badge */}
          <div className="absolute bottom-3 end-3 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{isArabic ? 'اضغط للتكبير' : 'Tap to zoom'}</span>
          </div>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute start-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </>
          )}
        </div>

        {/* Gallery Dots Indicator */}
        {photos.length > 1 && (
          <div className="py-2.5 px-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPhotoIdx(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentPhotoIdx ? 'w-6 bg-emerald-800' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Price and Title directly below the photos */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-900 tracking-tight">
              {formatPriceSDG(listing.price, isArabic)}
            </span>
          </div>
          {listing.priceNegotiable ? (
            <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg">
              {isArabic ? 'قابل للتفاوض' : 'Negotiable'}
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg">
              {isArabic ? 'السعر نهائي' : 'Fixed Price'}
            </span>
          )}
        </div>

        <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
          {isArabic ? listing.title : listing.titleEn}
        </h1>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-500 font-medium pt-1">
          <div className="flex items-center gap-1 text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-800" />
            <span>{isArabic ? listing.locationDetails || listing.city : listing.locationDetailsEn || listing.cityEn}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{isArabic ? `تاريخ النشر: ${listing.createdAt}` : `Published: ${listing.createdAtEn}`}</span>
          </div>
        </div>
      </div>

      {/* 3. Quick-scan row of key specs (mileage, location, year, etc.) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
        <h2 className="text-xs sm:text-sm font-bold text-slate-700">
          {isArabic ? 'المواصفات الأساسية للمركبة:' : 'Key Vehicle Specs:'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {/* Year */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">{isArabic ? 'سنة الصنع' : 'Year'}</p>
              <p className="text-sm font-bold text-slate-900">{listing.year}</p>
            </div>
          </div>

          {/* Mileage */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">{isArabic ? 'الممشى (العداد)' : 'Mileage'}</p>
              <p className="text-sm font-bold text-slate-900">{formatMileage(listing.mileage, isArabic)}</p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">{isArabic ? 'المدينة' : 'Location'}</p>
              <p className="text-sm font-bold text-slate-900 truncate">{isArabic ? listing.city : listing.cityEn}</p>
            </div>
          </div>

          {/* Transmission / Gear */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">{isArabic ? 'ناقل الحركة (القير)' : 'Transmission'}</p>
              <p className="text-sm font-bold text-slate-900">{listing.transmission}</p>
            </div>
          </div>

          {/* Fuel Type */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">{isArabic ? 'نوع الوقود' : 'Fuel Type'}</p>
              <p className="text-sm font-bold text-slate-900">{listing.fuelType}</p>
            </div>
          </div>

          {/* Body Type */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
              <CarFront className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">{isArabic ? 'نوع المركبة' : 'Body Type'}</p>
              <p className="text-sm font-bold text-slate-900 truncate">{isArabic ? listing.bodyType : listing.bodyTypeEn}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. The seller's description, in free text (authentic Sudanese format) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">
          {isArabic ? 'تفاصيل ووصف البائع:' : "Seller's Description:"}
        </h2>
        <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4 text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium font-['Tajawal',sans-serif]">
          {isArabic ? listing.description : listing.descriptionEn}
        </div>
      </div>

      {/* 5. Basic seller info (Name, Verified badge placeholder) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-black text-lg flex items-center justify-center shadow-xs">
            {listing.seller.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{listing.seller.name}</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isArabic
                ? `عضو منذ ${listing.seller.memberSince} • ${listing.seller.city}`
                : `Member since ${listing.seller.memberSince} • ${listing.seller.city}`}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar - Always accessible while scrolling */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
          {/* Direct Phone Call */}
          <a
            id="sticky-phone-call-btn"
            href={`tel:${listing.seller.phone.replace(/[^0-9+]/g, '')}`}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-xl flex items-center justify-center shrink-0 min-w-[48px] min-h-[48px] transition-colors"
            title={isArabic ? `اتصال (${listing.seller.phone})` : `Call ${listing.seller.phone}`}
            aria-label="Call seller"
          >
            <Phone className="w-5 h-5 text-emerald-800" />
          </a>

          {/* Direct WhatsApp */}
          <a
            id="sticky-whatsapp-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] border border-[#25D366]/30 rounded-xl flex items-center justify-center shrink-0 min-w-[48px] min-h-[48px] transition-colors"
            title={isArabic ? 'واتساب مباشر' : 'WhatsApp'}
            aria-label="WhatsApp seller"
          >
            <MessageCircle className="w-5 h-5 fill-[#25D366]" />
          </a>

          {/* Sticky 'Message Seller' Action */}
          <button
            id="sticky-msg-seller-btn"
            onClick={() => setIsMessageModalOpen(true)}
            className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-xs min-h-[48px] cursor-pointer transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{isArabic ? 'مراسلة البائع' : 'Message Seller'}</span>
          </button>
        </div>
      </div>

      {/* Photo Zoom Modal */}
      <PhotoZoomModal
        isOpen={isZoomOpen}
        photos={photos}
        currentIndex={currentPhotoIdx}
        onClose={() => setIsZoomOpen(false)}
        onNavigate={(idx) => setCurrentPhotoIdx(idx)}
        isArabic={isArabic}
        title={isArabic ? listing.title : listing.titleEn}
      />

      {/* Message Seller Modal */}
      <MessageSellerModal
        isOpen={isMessageModalOpen}
        listing={listing}
        onClose={() => setIsMessageModalOpen(false)}
        isArabic={isArabic}
      />
    </div>
  );
};
