import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use /algoviz/ base when building for GitHub Pages, / everywhere else
  base: process.env.GITHUB_ACTIONS ? '/algoviz/' : '/',
  server: { port: 5190, strictPort: true },
})
