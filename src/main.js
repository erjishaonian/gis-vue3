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
// import '@/assets/untils/color.scss'

// highlight 的样式，依赖包，组件
import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'

import axios from './axios'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.config.globalProperties.$axios = axios
app.config.warnHandler = () => null
app.use(store).use(hljsVuePlugin).use(router).use(ElementPlus).mount('#app')
