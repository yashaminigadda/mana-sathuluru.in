import React from 'react'
import { Instagram, Youtube, Facebook, ArrowUpRight, Sparkles, Heart, Film, Users } from 'lucide-react'

export default function SocialSection() {
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/mana_sathuluru/'
  const youtubeUrl = import.meta.env.VITE_YOUTUBE_URL || ''
  const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || ''

  const socialLinks = [
    {
      name: 'Instagram',
      handle: '@mana_sathuluru',
      desc: 'Daily village stories, reels, heritage snapshots & community updates.',
      url: instagramUrl,
      icon: Instagram,
      primary: true,
      badge: 'Official Community Channel'
    },
    ...(youtubeUrl ? [{
      name: 'YouTube',
      handle: 'Mana Sathuluru',
      desc: 'Long-form documentary videos and festive village coverage.',
      url: youtubeUrl,
      icon: Youtube,
      primary: false,
      badge: 'Video Archive'
    }] : []),
    ...(facebookUrl ? [{
      name: 'Facebook',
      handle: 'Mana Sathuluru',
      desc: 'Community discussions and village family network.',
      url: facebookUrl,
      icon: Facebook,
      primary: false,
      badge: 'Community Group'
    }] : []),
  ]

  return (
    <section id="instagram" className="relative py-24 md:py-32 bg-[#090a0f] overflow-hidden border-t border-amber-500/10">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        
        {/* Section Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-500/25 bg-pink-500/10 mb-6">
          <Instagram className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-xs uppercase tracking-[0.2em] text-pink-300 font-medium">
            Instagram Spotlight
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Connect on <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Instagram</span>
        </h2>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          Experience our village in motion. Discover daily reels, festive celebrations, temple rituals, and heartfelt memories directly from Sathuluru.
        </p>

        {/* Prominent Instagram Feature Card */}
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-pink-500/25 shadow-[0_25px_60px_rgba(0,0,0,0.8)] mb-12 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
              {/* Instagram Story Gradient Ring Avatar */}
              <div className="relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-xl shrink-0">
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
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white border-2 border-slate-950">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-pink-500/15 text-pink-300 border border-pink-500/30 mb-2">
                  <Sparkles className="w-3 h-3" /> Official Instagram Channel
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-1">
                  @mana_sathuluru
                </h3>
                <p className="text-sm text-slate-300 max-w-md">
                  Reels, Stories, Heritage & Everyday Village Moments from Sathuluru
                </p>

                {/* Highlights pill tags */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4 text-xs text-slate-400">
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <Film className="w-3 h-3 text-pink-400" /> Daily Reels
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-rose-400" /> Village Heritage
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-amber-400" /> Community
                  </span>
                </div>
              </div>
            </div>

            {/* Right: CTA Follow Button */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-base tracking-wide hover:shadow-[0_0_40px_rgba(244,63,94,0.5)] hover:scale-[1.03] active:scale-95 transition-all duration-300 shrink-0"
            >
              <Instagram className="w-5 h-5" />
              <span>Follow on Instagram</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Additional Social Channels (if any configured) */}
        {socialLinks.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {socialLinks.slice(1).map((link, idx) => {
              const Icon = link.icon
              return (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl glass-panel glass-panel-hover flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-gold-400 group-hover:border-gold-500/30 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold text-white group-hover:text-gold-200 transition-colors">
                        {link.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {link.handle}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}
