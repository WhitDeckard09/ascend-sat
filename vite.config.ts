import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Served from https://whitdeckard09.github.io/ascend-sat/, so built asset
  // URLs need that prefix. Change this if the repo is ever renamed.
  base: '/ascend-sat/',
  plugins: [react(), tailwindcss()],
  server: { port: 5180 },
})
