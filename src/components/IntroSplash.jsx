import React, { useState, useEffect } from 'react'
import { Sparkles, Instagram } from 'lucide-react'

export default function IntroSplash() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // 2.0s display, then 700ms graceful fade-out
    const fadeTimer = setTimeout(() => {
      setIsFading(true)
    }, 2000)

    const removeTimer = setTimeout(() => {
      setIsVisible(false)
    }, 2700)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      onClick={() => setIsFading(true)}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050608] cursor-pointer transition-all duration-700 ease-out ${
        isFading ? 'opacity-0 pointer-events-none scale-105 backdrop-blur-2xl' : 'opacity-100'
      }`}
      aria-label="Welcome to Mana Sathuluru"
    >
      {/* Cinematic Golden & Rose Radial Bloom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-r from-pink-600/20 via-gold-500/30 to-amber-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Noise Texture */}
      <div className="absolute inset-0 film-grain opacity-30 pointer-events-none" />

      {/* Center Branding Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">
        
        {/* Circular Avatar Badge */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-[0_0_45px_rgba(229,169,60,0.35)] flex items-center justify-center mb-5 animate-aesthetic-badge">
          <div className="w-full h-full rounded-full bg-slate-950 p-[2px] overflow-hidden">
            <div 
              className="w-full h-full rounded-full bg-cover bg-center"
              style={{
                backgroundImage: "url('/mana-sathuluru-full.jpg')",
                backgroundSize: '300%',
                backgroundPosition: 'center 49%'
              }}
            />
          </div>
        </div>

        {/* Brand Name: MANA SATHULURU */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-2 select-none animate-aesthetic-title">
          <span className="text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
            MANA{' '}
          </span>
          <span className="text-gold-gradient text-subtle-glow">
            SATHULURU
          </span>
        </h1>

        {/* Telugu Subtitle */}
        <p className="font-serif text-gold-400/90 text-lg sm:text-xl font-medium tracking-widest mb-3 animate-aesthetic-sub">
          మన సాతులూరు • Our Village • Our Pride
        </p>

        {/* Instagram Handle Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-6">
          <Instagram className="w-3 h-3" />
          <span>@mana_sathuluru</span>
        </div>

        {/* Aesthetic Golden Loading Bar */}
        <div className="w-36 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-500 via-pink-400 to-amber-300 w-full animate-[progress_1.6s_ease-in-out_infinite]" />
        </div>

        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mt-4">
          Click anywhere to enter
        </span>
      </div>
    </div>
  )
}
