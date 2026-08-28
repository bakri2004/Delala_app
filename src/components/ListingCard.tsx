import React from 'react';
import { MapPin, Camera, Clock } from 'lucide-react';
import { VehicleListing } from '../types';
import { formatCardPrice } from '../lib/formatters';

interface ListingCardProps {
  listing: VehicleListing;
  onSelect: (listing: VehicleListing) => void;
  isArabic: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelect,
  isArabic,
}) => {
  return (
    <div
      id={`listing-card-${listing.id}`}
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-700/50 transition-all duration-200 cursor-pointer flex flex-col focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(listing);
        }
      }}
    >
      {/* Photo Container */}
      <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-slate-100 overflow-hidden">
        <img
          src={listing.photos[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
          alt={isArabic ? listing.title : listing.titleEn}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Photo Count Badge */}
        {listing.photos.length > 1 && (
          <div className="absolute bottom-2 start-2 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" />
            <span>{listing.photos.length}</span>
          </div>
        )}

        {/* Body Type Pill */}
        <div className="absolute top-2 end-2 bg-white/95 text-slate-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-slate-200">
          {isArabic ? listing.bodyType : listing.bodyTypeEn}
        </div>
      </div>

      {/* Content Area - Minimal & Scannable */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
        {/* Price (Bold & Prominent) */}
        <div>
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <span className="text-base sm:text-lg lg:text-xl font-black text-emerald-900 tracking-tight">
              {formatCardPrice(listing.price, isArabic)}
            </span>
            {listing.priceNegotiable && (
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">
                {isArabic ? 'قابل للتفاوض' : 'Negotiable'}
              </span>
            )}
          </div>

          {/* Title: Make / Model / Year */}
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-emerald-800 transition-colors">
            {isArabic ? listing.title : listing.titleEn}
          </h3>
        </div>

        {/* Location & Time Footer */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span className="truncate">{isArabic ? listing.city : listing.cityEn}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 shrink-0 text-[10px] sm:text-[11px]">
            <Clock className="w-3 h-3" />
            <span>{isArabic ? listing.createdAt : listing.createdAtEn}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
