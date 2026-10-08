import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          supabase: ['@supabase/supabase-js'],
          qrcode: ['qrcode'],
          vendor: ['react', 'react-dom', 'lucide-react', 'clsx', 'tailwind-merge']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
