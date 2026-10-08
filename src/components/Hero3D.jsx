import React, { useState, useEffect } from 'react'
import { Share2, Copy, QrCode, Instagram, Check, ExternalLink, X, MapPin, ArrowRight } from 'lucide-react'

export default function Hero3D() {
  const [copied, setCopied] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [activeBtn, setActiveBtn] = useState(null)
  const [mounted, setMounted] = useState(false)
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/mana_sathuluru/'

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Mana Sathuluru', url: window.location.href }) }
      catch { handleCopyLink() }
    } else { handleCopyLink() }
  }

  const press = (id) => {
    setActiveBtn(id)
    setTimeout(() => setActiveBtn(null), 280)
  }

  const actionBtns = [
    { id: 'share',  Icon: Share2,    label: 'Share',     color: '#fbbf24', action: () => { press('share'); handleShare() } },
    { id: 'copy',   Icon: copied ? Check : Copy, label: copied ? 'Copied!' : 'Copy', color: '#34d399', action: () => { press('copy'); handleCopyLink() } },
    { id: 'qr',     Icon: QrCode,    label: 'QR Code',   color: '#f59e0b', action: () => { press('qr'); setShowQrModal(true) } },
    { id: 'ig',     Icon: Instagram, label: 'Instagram', color: '#f472b6', action: null, href: instagramUrl },
  ]

  return (
    <>
      {/* ── Google Fonts: Space Grotesk ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      <section
        id="home"
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #090a0f 0%, #121520 45%, #0a0b10 100%)' }}
      >
        {/* ── AMBER DOT GRID BACKGROUND ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.12) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />

        {/* ── GLOW ORBS ── */}
        <div className="absolute pointer-events-none" style={{
          top: '10%', left: '15%', width: 480, height: 480,
          background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: '10%', right: '10%', width: 360, height: 360,
          background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />

        {/* ── HERO CONTENT ── */}
        <div
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl w-full"
          style={{ transition: 'opacity 0.8s ease, transform 0.8s ease', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)' }}
        >

          {/* Top badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
            style={{ borderColor: 'rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.08)', backdropFilter: 'blur(12px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#fcd34d', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em' }}>
              ANDHRA PRADESH — INDIA
            </span>
          </div>

          {/* Main heading */}
          <div className="mb-2">
            <h1 style={{ fontFamily: "'DM Serif Display', serif", lineHeight: 1, margin: 0 }}>
              <span style={{
                display: 'block',
                fontSize: 'clamp(3.5rem, 10vw, 7.5rem)',
                fontWeight: 400,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                textShadow: '0 0 60px rgba(255,255,255,0.2)',
              }}>
                Mana
              </span>
              <span style={{
                display: 'block',
                fontSize: 'clamp(3.2rem, 9.5vw, 7rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                letterSpacing: '-0.01em',
                background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 35px rgba(245,158,11,0.45))',
              }}>
                Sathuluru
              </span>
            </h1>
          </div>

          {/* Divider line */}
          <div className="flex items-center gap-4 mb-5 w-full max-w-sm">
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.5))' }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: '#fcd34d', letterSpacing: '0.3em', fontWeight: 600 }}>
              OUR VILLAGE · OUR PRIDE
            </span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(245,158,11,0.5))' }} />
          </div>

          {/* Location tag */}
          <div className="flex items-center gap-1.5 mb-12"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 500 }}>
            <MapPin size={14} style={{ color: '#ef4444' }} />
            Satuluru, Andhra Pradesh, India
          </div>

          {/* ── ACTION ICON BUTTONS ── */}
          <div className="flex items-center justify-center gap-4 mb-10 flex-wrap">
            {actionBtns.map(({ id, Icon, label, color, action, href }) => {
              const isActive = activeBtn === id
              const inner = (
                <div className="flex flex-col items-center gap-2">
                  <div
                    style={{
                      width: 56, height: 56,
                      borderRadius: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isActive ? `${color}33` : 'rgba(255,255,255,0.06)',
                      border: `1.5px solid ${isActive ? color : 'rgba(255,255,255,0.15)'}`,
                      backdropFilter: 'blur(16px)',
                      boxShadow: isActive ? `0 0 25px ${color}55` : '0 4px 20px rgba(0,0,0,0.3)',
                      transform: isActive ? 'scale(0.88)' : 'scale(1)',
                      transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  >
                    <Icon size={20} style={{ color: isActive ? color : '#ffffff' }} />
                  </div>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
                    color: isActive ? color : 'rgba(255,255,255,0.8)',
                    transition: 'color 0.15s',
                  }}>
                    {label}
                  </span>
                </div>
              )
              return href
                ? <a key={id} href={href} target="_blank" rel="noopener noreferrer" onMouseDown={() => press(id)} className="cursor-pointer">{inner}</a>
                : <button key={id} onMouseDown={action} className="cursor-pointer bg-transparent border-none p-0">{inner}</button>
            })}
          </div>

          {/* ── CTA BUTTONS ── */}
          <div className="flex flex-col sm:flex-row items-center gap-3">

            {/* Primary CTA */}
            <button
              id="btn-explore"
              onMouseDown={() => { press('explore'); scrollToSection('satuluru') }}
              className="cursor-pointer flex items-center gap-2.5 border-none"
              style={{
                padding: '13px 32px',
                borderRadius: 14,
                background: activeBtn === 'explore'
                  ? 'linear-gradient(135deg, #fbbf24, #d97706)'
                  : 'linear-gradient(135deg, #f59e0b, #b45309)',
                color: '#000000',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: 14, letterSpacing: '0.04em',
                boxShadow: '0 8px 32px rgba(245,158,11,0.4)',
                transform: activeBtn === 'explore' ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.15s ease',
              }}
            >
              Explore Sathuluru
              <ArrowRight size={16} color="#000000" />
            </button>

            {/* Secondary CTA */}
            <button
              id="btn-contact"
              onMouseDown={() => { press('contact'); scrollToSection('contact') }}
              className="cursor-pointer flex items-center gap-2.5 border-none"
              style={{
                padding: '12px 32px',
                borderRadius: 14,
                background: activeBtn === 'contact' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600, fontSize: 14, letterSpacing: '0.04em',
                border: '1.5px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(12px)',
                transform: activeBtn === 'contact' ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.15s ease',
              }}
            >
              Get in Touch
            </button>
          </div>

          {/* Scroll hint */}
          <div className="mt-14 flex flex-col items-center gap-2 opacity-50">
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(245,158,11,0.8), transparent)' }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: '#fbbf24', letterSpacing: '0.25em', fontWeight: 600 }}>SCROLL</span>
          </div>

        </div>

        {/* ── CLIPBOARD TOAST ── */}
        {copied && (
          <div style={{
            position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            zIndex: 50, padding: '12px 24px', borderRadius: 16,
            background: 'rgba(15,18,28,0.95)', border: '1px solid rgba(245,158,11,0.4)',
            backdropFilter: 'blur(20px)', boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
            display: 'flex', itemsCenter: 'center', gap: 10,
            fontFamily: "'Space Grotesk', sans-serif", color: '#ffffff', fontSize: 14, fontWeight: 500,
          }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={12} color="#34d399" strokeWidth={3} />
            </div>
            Link copied to clipboard!
          </div>
        )}

        {/* ── QR MODAL ── */}
        {showQrModal && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(9,10,15,0.88)', backdropFilter: 'blur(16px)', padding: 16 }}
            onClick={() => setShowQrModal(false)}
          >
            <div
              style={{ background: '#121520', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 28, padding: 28, maxWidth: 340, width: '100%', textAlign: 'center', position: 'relative', boxShadow: '0 32px 80px rgba(0,0,0,0.9)' }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowQrModal(false)} aria-label="Close"
                style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} />
              </button>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#ffffff', marginBottom: 4 }}>Mana Sathuluru</h3>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#fcd34d', marginBottom: 24 }}>Scan to visit & follow on Instagram</p>
              <div style={{ width: 200, height: 200, margin: '0 auto 24px', background: '#fff', padding: 10, borderRadius: 16, overflow: 'hidden' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href || instagramUrl)}`} alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleCopyLink} style={{ flex: 1, padding: '11px 0', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 12, cursor: 'pointer', letterSpacing: '0.06em' }}>
                  COPY LINK
                </button>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, padding: '11px 0', borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, letterSpacing: '0.06em', textDecoration: 'none' }}>
                  INSTAGRAM <ExternalLink size={11} color="#000" />
                </a>
              </div>
            </div>
          </div>
        )}

      </section>
    </>
  )
}