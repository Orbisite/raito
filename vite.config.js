import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Pages projet : `https://orbisite.github.io/leo-giraud/` → base `/leo-giraud/`. Local : `/`. */
const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
  resolve: {
    alias: {
      '@mdi/react': path.resolve(__dirname, 'node_modules/@mdi/react'),
      '@mdi/js': path.resolve(__dirname, 'node_modules/@mdi/js'),
    },
  },
  optimizeDeps: {
    include: ['@orbisite/blocks', '@mdi/react'],
  },
})
