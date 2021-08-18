import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import tools from './utils/tools.js';
import axios from './utils/axios.js';
import './utils/rem';
import VConsole from 'vconsole';

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');

// 挂载全局属性和方法
app.config.globalProperties.$tools = tools;
app.config.globalProperties.$axios = axios;

// 开发环境开启vConsole
if (import.meta.env.MODE) {
  const vConsole = new VConsole();
}
