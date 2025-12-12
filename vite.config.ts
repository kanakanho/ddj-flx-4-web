/* eslint-disable node/prefer-global/process */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  base: process.env.GITHUB_PAGES ? 'ddj-flx-4-web' : './',
})
