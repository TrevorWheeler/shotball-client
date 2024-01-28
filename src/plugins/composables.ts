import router from '@/router';
import { Toast, ToastOptions } from '@/plugins/toast';
import type { App } from 'vue';
import pinia from '@/plugins/pinia';
import Tooltip from '@/components/tooltip.vue'
export function setComposables(app: any) {
  app.component('Tooltip', Tooltip)
}
