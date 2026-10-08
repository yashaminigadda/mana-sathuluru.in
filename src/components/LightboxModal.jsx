import React, { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Sparkles } from 'lucide-react'

export default function LightboxModal({ item, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, onPrev, onNext])

  if (!item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox Preview"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-2xl transition-opacity animate-in fade-in duration-300"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close modal preview"
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-slate-900/80 border border-white/20 text-slate-200 hover:text-gold-300 hover:border-gold-500/50 hover:bg-black/90 transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Navigation */}
      <button
        onClick={onPrev}
        aria-label="Previous image"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 border border-white/20 text-slate-200 hover:text-gold-300 hover:border-gold-500/50 hover:scale-105 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Navigation */}
      <button
        onClick={onNext}
        aria-label="Next image"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 border border-white/20 text-slate-200 hover:text-gold-300 hover:border-gold-500/50 hover:scale-105 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row rounded-3xl overflow-hidden glass-panel border border-gold-500/30 shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
      >
        {/* Full Image */}
        <div className="md:w-7/12 bg-black flex items-center justify-center overflow-hidden max-h-[60vh] md:max-h-[85vh]">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-contain md:object-cover"
          />
        </div>

        {/* Details Panel */}
        <div className="md:w-5/12 p-6 sm:p-8 flex flex-col justify-between bg-[#0b0e15]/95 border-t md:border-t-0 md:border-l border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold-500/15 border border-gold-500/30 text-gold-300">
                {item.tag}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-gold-400/80" />
                <span>{item.date}</span>
              </div>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
              {item.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-gold-300 mb-5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{item.location}</span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {item.caption}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Mana Satuluru Archive
            </span>
            <span className="font-serif italic text-gold-300/80">
              Mana Ooru. Mana Gnapakalu.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
