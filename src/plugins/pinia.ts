import { markRaw } from 'vue';
import { createPinia } from 'pinia';
import type { Router } from 'vue-router';
import router from '@/router';
declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router;
  }
}
export default createPinia().use(({ store }) => {
  store.router = markRaw(router);
});
