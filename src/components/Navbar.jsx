import React, { useState, useEffect } from 'react'
import { Instagram, Menu, X, ArrowUpRight } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('home')

  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/mana_sathuluru/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'HOME', href: '#home', id: 'home' },
    { name: 'INSTAGRAM', href: instagramUrl, id: 'instagram', isExternal: true },
    { name: 'ABOUT', href: '#about', id: 'about' },
    { name: 'SATHULURU', href: '#satuluru', id: 'satuluru' },
    { name: 'CONTACT', href: '#contact', id: 'contact' },
  ]

  const handleLinkClick = (e, href, id, isExternal) => {
    if (isExternal) return
    e.preventDefault()
    setActiveNav(id)
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-auto ${
          isScrolled
            ? 'py-3 bg-[#090a0f]/95 backdrop-blur-xl border-b border-amber-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'py-5 bg-gradient-to-b from-[#090a0f]/90 via-[#090a0f]/50 to-transparent backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Brand Logo / Text */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home', 'home', false)}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="Mana Sathuluru Home"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:border-amber-300 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-all">
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="font-bold text-xs tracking-wider text-amber-300">MS</span>
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                className="text-base sm:text-lg tracking-wider font-bold text-white group-hover:text-amber-300 transition-colors"
              >
                MANA SATHULURU
              </span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-[9px] tracking-[0.25em] text-amber-400/90 uppercase font-semibold -mt-0.5">
                OUR VILLAGE • OUR PRIDE
              </span>
            </div>
          </a>

          {/* Desktop Capsule Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121520]/80 border border-amber-500/20 backdrop-blur-md shadow-lg">
            {navLinks.map((link) => {
              const isActive = activeNav === link.id
              if (link.isExternal) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition-all"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>INSTAGRAM</span>
                  </a>
                )
              }
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href, link.id, false)}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-amber-500/20 border border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </a>
              )
            })}
          </nav>

          {/* Right Action: FOLLOW US Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Space Grotesk', sans-serif", background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-300/40"
            >
              <Instagram className="w-3.5 h-3.5 text-black" />
              <span>FOLLOW US</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile navigation menu"
            className="md:hidden p-2 rounded-xl bg-[#121520] border border-amber-500/30 text-amber-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#090a0f]/98 backdrop-blur-2xl flex flex-col justify-between pt-28 pb-8 px-6 transition-all duration-300">
          <div className="flex flex-col gap-2">
            <p style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold px-4 mb-2">
              Menu Navigation
            </p>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.isExternal ? '_blank' : '_self'}
                rel={link.isExternal ? 'noopener noreferrer' : ''}
                onClick={(e) => handleLinkClick(e, link.href, link.id, link.isExternal)}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                className="px-4 py-3.5 rounded-xl text-lg font-bold text-white hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-amber-500/20 flex flex-col gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Space Grotesk', sans-serif", background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-black font-bold tracking-wider shadow-lg border border-amber-300/40"
            >
              <Instagram className="w-4 h-4 text-black" />
              <span>Follow @mana_sathuluru</span>
              <ArrowUpRight className="w-4 h-4 text-black" />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
