import React from 'react'
import { Instagram, Youtube, Facebook, ArrowUp, Heart } from 'lucide-react'

export default function Footer() {
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/mana_sathuluru/'
  const youtubeUrl = import.meta.env.VITE_YOUTUBE_URL || ''
  const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || ''

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Instagram', href: instagramUrl, isExternal: true },
    { name: 'About', href: '#about' },
    { name: 'Sathuluru', href: '#satuluru' },
    { name: 'Contact', href: '#contact' },
  ]

  const handleLinkClick = (e, href, isExternal) => {
    if (isExternal) return
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-[#090a0f] border-t border-amber-500/15 pt-16 pb-12 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Tier: Brand, Tagline, & Quick Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-amber-500/15">
          {/* Brand & Tagline */}
          <div className="text-center md:text-left">
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold tracking-wider text-white mb-1">
              MANA SATHULURU
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-xs tracking-widest text-amber-300 font-medium uppercase">
              “Mana Ooru. Mana Gnapakalu. Mana Sathuluru.”
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.isExternal ? '_blank' : '_self'}
                rel={link.isExternal ? 'noopener noreferrer' : ''}
                onClick={(e) => handleLinkClick(e, link.href, link.isExternal)}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                className="text-xs uppercase tracking-widest text-slate-300 hover:text-amber-300 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Social Icons & Back to Top */}
          <div className="flex items-center gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile @mana_sathuluru"
              className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:text-pink-300 hover:border-pink-400 hover:scale-110 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-amber-300 hover:border-amber-500/30 hover:scale-105 transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}

            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-amber-300 hover:border-amber-500/30 hover:scale-105 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 hover:bg-amber-500/25 hover:border-amber-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Village Heritage */}
        <div style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p>© 2026 Mana Sathuluru. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-300">
            <span>Dedicated with</span>
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
            <span>to the soil, people & culture of Sathuluru.</span>
          </p>
        </div>

      </div>
    </footer>
  )
}
