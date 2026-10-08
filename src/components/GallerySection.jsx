import React, { useState } from 'react'
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../data/galleryData'
import { Eye, MapPin, Sparkles, Image as ImageIcon } from 'lucide-react'
import LightboxModal from './LightboxModal'

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeItemIndex, setActiveItemIndex] = useState(null)

  const filteredItems = selectedCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory)

  const handlePrev = () => {
    if (activeItemIndex === null) return
    setActiveItemIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1))
  }

  const handleNext = () => {
    if (activeItemIndex === null) return
    setActiveItemIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0))
  }

  return (
    <section id="gallery" className="relative py-28 md:py-36 bg-[#060709] overflow-hidden border-t border-white/[0.04]">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-700/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 mb-4">
              <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-gold-300 font-medium">
                Visual Chronicles
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
              Glimpses of <span className="text-gold-gradient">Satuluru</span>
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Every frame holds a story, a scent of rain-soaked earth, and a timeless memory of home. Click any photograph to explore the moments.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-gold-500 text-slate-950 font-semibold shadow-[0_0_20px_rgba(229,169,60,0.35)]'
                    : 'glass-panel text-slate-400 hover:text-white hover:border-gold-500/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveItemIndex(index)}
              className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-gold-500/40 cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-95 group-hover:brightness-105"
                  loading="lazy"
                />
                
                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-[#06080d]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/15 text-gold-300">
                    {item.tag}
                  </span>
                </div>

                {/* View Icon on Hover */}
                <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all">
                  <Eye className="w-4 h-4 text-gold-300" />
                </div>
              </div>

              {/* Caption & Info Panel */}
              <div className="p-5 flex flex-col justify-between bg-gradient-to-b from-[#090c13] to-[#07090e]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white mb-1.5 group-hover:text-gold-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {item.caption}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-gold-400/90">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeItemIndex !== null && (
        <LightboxModal
          item={filteredItems[activeItemIndex]}
          onClose={() => setActiveItemIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  )
}
