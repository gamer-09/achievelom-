import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// COSMOGRAPHIA — the heavens, as the ancients drew them.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
  },
})
