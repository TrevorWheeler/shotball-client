import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { compilerOptions, transformAssetUrls } from 'vue3-pixi';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ template: { compilerOptions, transformAssetUrls } }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080
  }
})
// "plugin:vue/vue3-essential",
// "plugin:vue/vue3-strongly-recommended",
// "plugin:vue/vue3-recommended"

// <!-- {
//   "vue/multi-word-component-names": ["error", {
//     "ignores": []
//   }]
// } -->