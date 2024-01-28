import pinia from './pinia'
import router from '@/router'
import { Toast, ToastOptions } from './toast'
import type { App } from 'vue'

export function registerPlugins(app: App) {
  app.use(pinia).use(router).use(Toast, ToastOptions)
}
