import Toast, { type PluginOptions } from 'vue-toastification';
import { POSITION } from 'vue-toastification';

type Options = typeof PluginOptions;

import 'vue-toastification/dist/index.css';

const ToastOptions: Options = {
  position: POSITION.BOTTOM_CENTER,
  icon: false,
  closeButton: false,
  hideProgressBar: true,
  timeout: 1700,
};

export { Toast, ToastOptions };
