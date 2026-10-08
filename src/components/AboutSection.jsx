import React from 'react'
import { Sparkles, Heart, Film, Users, ShieldCheck, MapPin } from 'lucide-react'

export default function AboutSection() {
  const pillars = [
    {
      icon: Film,
      title: 'Visual Chronicles',
      desc: 'Cinematic reels, photographs, and stories capturing the heartbeat of our streets and fields.'
    },
    {
      icon: Heart,
      title: 'Preserving Memories',
      desc: 'Keeping village nostalgia alive for youth living across the globe who cherish their roots.'
    },
    {
      icon: Users,
      title: 'United Community',
      desc: 'Connecting generations—from wise village elders at Racha Banda to aspiring young minds.'
    },
    {
      icon: ShieldCheck,
      title: 'Authentic Identity',
      desc: 'Built with genuine love and trust. No sensationalism, just the real essence of Sathuluru.'
    }
  ]

  return (
    <section id="about" className="relative py-28 md:py-36 bg-[#090a0f] overflow-hidden border-t border-amber-500/10">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story & Typography */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/30 bg-amber-500/10 w-fit mb-6 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold">
                The Essence & Purpose
              </span>
            </div>

            {/* Main Heading */}
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
              More Than a Page.{' '}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent block sm:inline">
                It's Our Ooru.
              </span>
            </h2>

            {/* Telugu Subtext */}
            <p style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-amber-300 text-xl font-medium mb-6">
              “మన ఊరు. మన జ్ఞాపకాలు. మన సాతులూరు.”
            </p>

            {/* Narrative description */}
            <div className="space-y-4 text-slate-300 font-normal leading-relaxed text-base sm:text-lg mb-10">
              <p>
                <strong className="text-white font-medium">Mana Sathuluru</strong> began as a heartfelt passion to document the everyday poetry of our village. It is a modern digital home built to showcase the serene beauty, timeless memories, resilient people, and vibrant culture of Sathuluru.
              </p>
              <p className="text-slate-400 text-base">
                Whether it is the golden sunrise spreading across lush paddy fields, the sacred chime of temple bells during festivals, or the evening camaraderie under the banyan tree, we bridge the nostalgia of our roots with the energy of contemporary digital storytelling.
              </p>
            </div>

            {/* 4 Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-3.5 group-hover:scale-105 group-hover:bg-gold-500/20 transition-all">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-white mb-1.5 group-hover:text-gold-200 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: 3D Visual Composition Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Outer Decorative Glow Ring */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-gold-500/20 via-transparent to-emerald-500/15 rounded-3xl blur-xl opacity-60" />

            {/* Main Interactive Composition Frame */}
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden glass-panel border border-gold-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
              {/* Primary Image with Cinematic Crop */}
              <div className="relative h-96 sm:h-[440px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
                  alt="Sathuluru Morning Landscape"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/30 to-transparent" />
              </div>

              {/* Floating Overlay Badge: Location */}
              <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-slate-200 shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>Sathuluru, Palnadu</span>
              </div>

              {/* Floating Overlay Card: Channel Philosophy */}
              <div className="absolute bottom-5 inset-x-5 p-5 rounded-xl bg-slate-950/80 backdrop-blur-xl border border-gold-500/25 shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold">
                    Digital Cultural Archive
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="font-serif text-sm text-slate-200 leading-snug">
                  “Honoring our heritage, celebrating everyday stories, and keeping our village close to our hearts wherever we go.”
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Palnadu District, AP</span>
                  <span className="text-gold-300 font-medium">@mana_sathuluru</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
