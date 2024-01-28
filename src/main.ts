import './assets/main.css'
import "@picocss/pico/css/pico.min.css";
import { createApp } from 'vue';


import App from './App.vue';

// Plugins
import { registerPlugins } from '@/plugins'
import { setComposables } from './plugins/composables'

const app = createApp(App)

registerPlugins(app)
setComposables(app)

app.mount('#app')
export { app }