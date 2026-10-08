import React, { useState } from 'react'
import { MapPin, Navigation, ExternalLink, Sun, Sparkles, Sprout, Landmark, HeartHandshake, Trees } from 'lucide-react'
import { SATULURU_INFO } from '../data/villageHighlights'

export default function SatuluruSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setTilt({
      x: -(y / (rect.height / 2)) * 8,
      y: (x / (rect.width / 2)) * 8,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const openGoogleMaps = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      SATULURU_INFO.googleMapsQuery
    )}`
    window.open(mapUrl, '_blank', 'noopener,noreferrer')
  }

  const facets = [
    {
      title: 'Village Atmosphere',
      desc: 'Wake up to the serene crowing of roosters, fresh morning breeze over water canals, and warm greetings exchanged at every doorstep.',
      icon: Sun,
      tag: 'Morning Serenity'
    },
    {
      title: 'Lush Green Nature',
      desc: 'Surrounded by fertile black cotton soils, endless green paddy rows, coconut palms, and shade of sprawling banyan trees.',
      icon: Trees,
      tag: 'Fertile Lands'
    },
    {
      title: 'Sacred Culture',
      desc: 'Century-old village traditions, devotional chants at dusk, temple festivals, and deep-rooted respect for ancestral values.',
      icon: Landmark,
      tag: 'Ancient Heritage'
    },
    {
      title: 'Local Life & Bonds',
      desc: 'Evenings at the village square, shared festivities across families, and a tight-knit community that stands by each other in every season.',
      icon: HeartHandshake,
      tag: 'Community Life'
    }
  ]

  return (
    <section id="satuluru" className="relative py-28 md:py-36 bg-[#121520] overflow-hidden border-t border-amber-500/10">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-950/20 via-gold-500/5 to-amber-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 mb-5">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-[0.2em] text-gold-300 font-medium">
              Our Geographical & Cultural Heart
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-5">
            Welcome to <span className="text-gold-gradient">Sathuluru</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            A tranquil, historic village in Palnadu district, Andhra Pradesh — nestled among emerald paddy fields, sacred shrines, and timeless generations of warmth.
          </p>
        </div>

        {/* Interactive 3D Location Card */}
        <div className="mb-16 flex justify-center perspective-[1200px]">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="w-full max-w-4xl p-6 sm:p-10 rounded-3xl glass-panel border border-gold-500/25 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden group"
          >
            {/* Ambient Background Glow inside card */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Info: Identity Details */}
              <div className="md:col-span-7 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-md bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-wider">
                    Interactive Location Card
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {SATULURU_INFO.coordinates}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                    {SATULURU_INFO.name}
                  </h3>
                  <span className="font-serif text-xl sm:text-2xl text-gold-400 font-medium">
                    ({SATULURU_INFO.teluguName})
                  </span>
                </div>

                <p className="text-sm text-slate-300 mb-6 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>{SATULURU_INFO.region}, {SATULURU_INFO.state}</span>
                </p>

                {/* Village Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-white/10 mb-6">
                  {SATULURU_INFO.stats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-sans">
                        {stat.label}
                      </span>
                      <span className="font-serif text-base sm:text-lg font-semibold text-gold-300">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* View on Map Button */}
                <div>
                  <button
                    onClick={openGoogleMaps}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gold-500 text-slate-950 font-semibold tracking-wide hover:bg-gold-400 hover:shadow-[0_0_30px_rgba(229,169,60,0.4)] active:scale-95 transition-all duration-300 group"
                  >
                    <MapPin className="w-4 h-4 text-slate-950 transition-transform group-hover:scale-110" />
                    <span>View on Map</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Opens Satuluru region on Google Maps without revealing private residences.
                  </p>
                </div>
              </div>

              {/* Right Visual: Atmospheric Village Miniature */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden relative border border-white/10 shadow-inner group/img">
                  <img
                    src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
                    alt="Satuluru Village Heritage"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold block mb-0.5">
                      Palnadu Heritage
                    </span>
                    <p className="text-xs text-slate-200">
                      Echoes of tradition, devotion, and community pride.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4 Facets of Satuluru */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facets.map((facet, idx) => {
            const Icon = facet.icon
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 group-hover:bg-gold-500/20 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {facet.tag}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-gold-200 transition-colors">
                    {facet.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {facet.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-gold-400 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3" />
                  <span>Satuluru Chronicle</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
