import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite-Konfiguration: aktiviert das Vue-Plugin (damit .vue-Dateien funktionieren)
export default defineConfig({
  plugins: [vue()],
})
