import React from 'react'
import IntroSplash from './components/IntroSplash'
import Navbar from './components/Navbar'
import Hero3D from './components/Hero3D'
import SocialSection from './components/SocialSection'
import AboutSection from './components/AboutSection'
import SatuluruSection from './components/SatuluruSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#060709] text-slate-100 flex flex-col relative selection:bg-gold-500/30 selection:text-gold-200">
      {/* Cinematic Opening Splash: Displays MANA SATHULURU on open */}
      <IntroSplash />

      {/* Subtle Cinematic Grain Texture */}
      <div className="fixed inset-0 film-grain z-30 pointer-events-none opacity-40" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero with 3D Village Emblem and Starting Instagram Highlight */}
        <Hero3D />

        {/* 2. Instagram Showcase & Social Highlight */}
        <SocialSection />

        {/* 3. About Sathuluru Heritage */}
        <AboutSection />

        {/* 4. Deep Village Culture & Landmarks */}
        <SatuluruSection />

        {/* 5. Message Submission Form & Instagram Direct */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
