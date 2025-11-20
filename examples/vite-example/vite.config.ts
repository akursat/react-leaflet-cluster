import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Deduplicate dependencies to avoid multiple React instances when using npm link
    dedupe: ['@react-leaflet/core'],
  },
})
