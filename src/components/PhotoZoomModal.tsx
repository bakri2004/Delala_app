import React, { useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ModalCloseButton } from './ModalCloseButton';

interface PhotoZoomModalProps {
  isOpen: boolean;
  photos: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  isArabic: boolean;
  title: string;
}

export const PhotoZoomModal: React.FC<PhotoZoomModalProps> = ({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onNavigate,
  isArabic,
  title,
}) => {
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        onNavigate(currentIndex < photos.length - 1 ? currentIndex + 1 : 0);
      }
      if (e.key === 'ArrowLeft') {
        onNavigate(currentIndex > 0 ? currentIndex - 1 : photos.length - 1);
      }
    },
    [currentIndex, photos.length, onClose, onNavigate]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setZoomLevel(1);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleNext = () => {
    setZoomLevel(1);
    onNavigate(currentIndex < photos.length - 1 ? currentIndex + 1 : 0);
  };

  const handlePrev = () => {
    setZoomLevel(1);
    onNavigate(currentIndex > 0 ? currentIndex - 1 : photos.length - 1);
  };

  return (
    <div
      id="photo-zoom-modal"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none"
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/40 text-white z-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold bg-white/15 px-3 py-1 rounded-full">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="text-xs sm:text-sm text-slate-300 font-medium truncate max-w-[200px] sm:max-w-md">
            {title}
          </span>
        </div>

        {/* Zoom Controls & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.5, 3))}
            title={isArabic ? 'تكبير الصورة' : 'Zoom in'}
            className="p-2 text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.5, 1))}
            title={isArabic ? 'تصغير الصورة' : 'Zoom out'}
            className="p-2 text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          {zoomLevel > 1 && (
            <button
              onClick={() => setZoomLevel(1)}
              title={isArabic ? 'إعادة ضبط الحجم' : 'Reset zoom'}
              className="p-2 text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <ModalCloseButton
            id="close-zoom-modal-btn"
            onClose={onClose}
            isArabic={isArabic}
            className="bg-white/20 hover:bg-white/35 active:bg-white/40 text-white border-white/25 ms-1"
          />
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6">
        {/* Navigation Arrow Left / Right */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute start-3 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/35 active:scale-95 text-white rounded-full transition-all z-20 cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
            </button>

            <button
              onClick={handleNext}
              className="absolute end-3 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/35 active:scale-95 text-white rounded-full transition-all z-20 cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6 rtl:rotate-180" />
            </button>
          </>
        )}

        {/* Zoomable Image */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={photos[currentIndex]}
            alt={title}
            className="max-h-[82vh] max-w-[94vw] object-contain rounded-lg shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip */}
      {photos.length > 1 && (
        <div className="py-3 px-4 bg-black/50 overflow-x-auto flex items-center justify-center gap-2 z-10">
          {photos.map((url, idx) => (
            <button
              key={idx}
              onClick={() => {
                setZoomLevel(1);
                onNavigate(idx);
              }}
              className={`relative w-14 h-11 sm:w-16 sm:h-12 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                idx === currentIndex ? 'border-emerald-500 scale-105 ring-2 ring-emerald-500/50' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={url}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
