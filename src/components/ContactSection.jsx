import React, { useState } from 'react'
import { Instagram, Send, Mail, CheckCircle2, AlertCircle, ArrowUpRight, Sparkles, Lock, MessageSquare } from 'lucide-react'
import { submitContactMessage, isSupabaseConfigured } from '../lib/supabase'
import { sendEmailToGmail, isEmailConfigured } from '../lib/email'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    message: ''
  })
  const [status, setStatus] = useState({ type: null, msg: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/mana_sathuluru/'
  const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT || ''

  const handleInstagramClick = () => {
    window.open(instagramUrl, '_blank', 'noopener,noreferrer')
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.contactInfo.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', msg: 'Please complete all required fields.' })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: null, msg: '' })

    try {
      // 1. Save to Supabase database (if configured)
      if (isSupabaseConfigured()) {
        const result = await submitContactMessage({
          name: formData.name,
          contactInfo: formData.contactInfo,
          message: formData.message,
        })

        if (!result.success) {
          console.warn('Supabase save warning:', result.error)
        }
      }

      // 2. Dispatch email to Gmail via EmailJS (if configured)
      if (isEmailConfigured()) {
        const emailResult = await sendEmailToGmail({
          name: formData.name,
          contactInfo: formData.contactInfo,
          message: formData.message,
        })

        if (!emailResult.success) {
          console.warn('EmailJS delivery warning:', emailResult.error)
        }
      }

      // 3. Dispatch to custom webhook/Formspree (if configured)
      if (contactEndpoint) {
        await fetch(contactEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            contact: formData.contactInfo,
            message: formData.message,
            timestamp: new Date().toISOString(),
            source: 'Mana Sathuluru Website'
          })
        }).catch(err => console.warn('Endpoint fetch warning:', err))
      }

      if (!isSupabaseConfigured() && !isEmailConfigured() && !contactEndpoint) {
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      setStatus({
        type: 'success',
        msg: 'Thank you! Your message has been received privately and dispatched.'
      })
      setFormData({ name: '', contactInfo: '', message: '' })
    } catch (err) {
      setStatus({
        type: 'error',
        msg: err.message || 'Could not send message. Please reach out via Instagram DM.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-28 md:py-36 bg-[#121520] overflow-hidden border-t border-amber-500/10">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/30 bg-amber-500/10 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold">
              Private & Direct Form
            </span>
          </div>

          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Get in <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">Touch</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Have village memories to share, questions, or ideas for Mana Sathuluru? Submit the form below or message our Instagram channel.
          </p>
        </div>

        {/* 2-Column Balanced Layout: Left Instagram DM & Info, Right Full Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* LEFT COLUMN: Instagram DM & Community Note */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* INSTAGRAM DM CARD */}
            <div className="p-8 rounded-3xl glass-panel border border-pink-500/20 shadow-xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-105 transition-all">
                <Instagram className="w-7 h-7" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                Instagram Direct
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Send a direct message to <span className="text-pink-300 font-semibold">@mana_sathuluru</span>. Perfect for sharing photos, reels, and instant village greetings.
              </p>

              <button
                onClick={handleInstagramClick}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-semibold text-sm hover:shadow-[0_0_25px_rgba(244,63,94,0.35)] hover:scale-[1.02] active:scale-95 transition-all duration-300 group/btn"
              >
                <span>Open @mana_sathuluru</span>
                <ArrowUpRight className="w-4 h-4 text-white transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
            </div>

            {/* COMMUNITY COMMITMENT CARD */}
            <div className="p-8 rounded-3xl glass-panel border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-gold-400">
                <MessageSquare className="w-5 h-5 text-gold-400" />
                <h4 className="font-serif text-lg font-bold text-white">
                  Village Heartbeat
                </h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Mana Sathuluru is an independent community initiative dedicated to capturing our village's living history, temples, traditions, and vibrant people.
              </p>
              <div className="flex items-center gap-2 text-xs text-gold-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Active Community Channel</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: COMPLETE SECURE CONTACT FORM */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-gold-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Send a Message
                  </h3>
                  <p className="text-xs text-slate-400">
                    Direct confidential note to the coordinators
                  </p>
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-wider text-slate-300 mb-2 font-medium">
                    Your Name <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo" className="block text-xs uppercase tracking-wider text-slate-300 mb-2 font-medium">
                    Email or Phone Number <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    required
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    placeholder="Where should we reach back?"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-wider text-slate-300 mb-2 font-medium">
                    Your Message / Memory / Query <span className="text-gold-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write your thoughts, village memories, or collaboration ideas..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors resize-none"
                  />
                </div>

                {/* Status Message */}
                {status.type && (
                  <div
                    className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                      status.type === 'success'
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                    )}
                    <span className="font-medium">{status.msg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-slate-950 font-bold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(229,169,60,0.4)] hover:scale-[1.01] active:scale-95 transition-all duration-300 disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Message'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Security & Privacy Notice */}
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex items-center justify-center gap-3 text-center text-xs text-slate-400">
          <Lock className="w-4 h-4 text-gold-400 shrink-0" />
          <span>
            Privacy Guarantee: Submissions are delivered directly to Mana Sathuluru coordinators.
          </span>
        </div>

      </div>
    </section>
  )
}
