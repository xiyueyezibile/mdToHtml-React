// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteEslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteEslint({
      failOnError: false
    })
  ],resolve: {
    alias: {
      "@": "/src",
    },
  },css: {
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        math: "always",
      },
    },
  },
})