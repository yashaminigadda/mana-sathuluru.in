# Mana Satuluru — Digital Identity & 3D Web Experience

> **“Mana Ooru. Mana Gnapakalu. Mana Satuluru.”**

A premium, modern, cinematic 3D website built for the Instagram-based community brand **Mana Satuluru**. Celebrating the village heritage, landscapes, people, festivals, and memories of Satuluru (Palnadu / Guntur region, Andhra Pradesh).

---

## ✨ Features & Architecture

- **Cinematic 3D Hero Scene**: Custom procedural Three.js environment featuring a winding village road, rolling paddy fields, silhouettes of traditional cottages and the historic temple Gopuram with a glowing golden kalasam, swaying palm trees, warm golden-hour sunset, and floating dust/firefly particles.
- **Interactive Parallax**: Camera smoothly reacts to mouse movement and scroll glide on desktop, with touch-responsive interaction on mobile devices.
- **Floating Glassmorphism Navigation**: Dynamic blur on scroll, quick section jumping, official Instagram channel shortcut, and an animated mobile drawer.
- **About Section**: Split layout articulating the platform's mission, Telugu cultural motto, and 4 core community pillars.
- **Satuluru Section**: Interactive 3D tilt card with regional highlights (Palnadu, Andhra Pradesh) and a secure "View on Map" button.
- **Visual Chronicles Gallery**: Category-filtered gallery (Village, Nature, Events, Memories, People, Culture) with hover zoom, glass overlays, and a fullscreen interactive lightbox modal (with keyboard navigation & Esc to close).
- **Social Presence**: Dedicated Instagram channel showcase with verified links and a prominent "Follow Our Journey" CTA.
- **Zero-Exposure Private Contact Hub**:
  - **Instagram DM**: Instant access to official direct messaging.
  - **WhatsApp**: Click-to-chat action without exposing the owner's phone number as visible text anywhere on the page or in HTML.
  - **Send a Message**: Private contact form supporting custom webhooks/endpoints (`VITE_CONTACT_ENDPOINT`) or email dispatches.
- **Mobile-First & Performance Optimized**: Responsive design, throttled pixel ratio and particle count on mobile, code-split vendor and Three.js bundles, and graceful WebGL fallbacks.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS + Custom Glassmorphism & Gold gradients
- **3D Graphics**: Three.js (Procedural geometries, ACESFilmic tone mapping, FogExp2)
- **Icons**: Lucide React
- **Typography**: Cinzel & Plus Jakarta Sans

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file based on `.env.example`:
```env
# Official Instagram Profile URL
VITE_INSTAGRAM_URL=https://instagram.com/mana_satuluru

# WhatsApp Contact Number (International format without '+' or spaces, e.g., 919876543210)
# NOTE: This number is NEVER rendered as visible text on the website.
VITE_WHATSAPP_NUMBER=919000000000

# Private Contact Form Submission Endpoint (e.g., Formspree, custom backend)
VITE_CONTACT_ENDPOINT=

# Fallback email
VITE_CONTACT_EMAIL=contact@manasatuluru.com

# Optional Social Links (Leave empty if not yet active)
VITE_YOUTUBE_URL=
VITE_FACEBOOK_URL=
```

### 4. Running Locally
```bash
# Start development server
npm run dev

# Or build and preview production bundle
npm run build
npm run preview
```

---

## 🔒 Privacy & Security Highlights

- **No Visible Phone Number**: The owner's WhatsApp number is kept strictly within configuration and never rendered as text or in visible HTML.
- **No Hardcoded Credentials**: API endpoints, secret tokens, and personal credentials are not bundled in client-side templates.
- **Sanitized Map Links**: The "View on Map" feature targets general village coordinates/regions rather than private residences.

---

## 📄 License
© 2026 Mana Satuluru. All rights reserved.
