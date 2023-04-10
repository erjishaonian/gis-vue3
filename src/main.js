import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'animate.css'

import '@/assets/pageTransition.css'
import '@/assets/untils/scroll.css'
import '@/assets/untils/main.css'

import axios from './axios'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.config.globalProperties.$axios = axios
app.use(store).use(router).use(ElementPlus).mount('#app')
