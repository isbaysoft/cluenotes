import fs from 'fs'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// icon sets: https://icon-sets.iconify.design
//
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   host: true, // Это то же самое, что --host 0.0.0.0
  //   hmr: {
  //     host: '192.168.1.189',
  //   },
  //   watch: {
  //     usePolling: true,
  //   },
  // },
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: 'icon',
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        id: '/',
        display: 'standalone',
        start_url: '/',
        name: 'Clue Notes',
        short_name: 'Clue Notes',
        description: 'Clue Notes - Digital Detective Sheet',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: 'screenshots/mobile.webp',
            sizes: '678x1466',
            type: 'image/webp',
            form_factor: 'narrow',
            label: 'Home Screen',
          },
          {
            src: 'screenshots/desktop.webp',
            sizes: '1280x696',
            type: 'image/webp',
            form_factor: 'wide',
            label: 'Desktop Dashboard',
          },
        ],
      },
      workbox: {
        // Resources to cache for offline availability
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,webp}'],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/_variables" as *;`,
      },
    },
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css', '.ts'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
