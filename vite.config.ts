import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: true
  },
  preview: {
    host: '0.0.0.0',
    cors: true,
    allowedHosts: ['nimblebimble.onrender.com', 'localhost', '127.0.0.1', '*']
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}) 