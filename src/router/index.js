import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index/index.vue'),
    props: {
      title: 'Page Title',
      content: 'Page Content'
    },
    meta: {
      // 添加路由元信息
      transitionName: 'page'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 在router.beforeEach中获取meta中的transitionName并保存在全局变量中
let transitionName = 'page'
router.beforeEach((to, from) => {
  transitionName = to.meta.transitionName || 'page'
  // console.log(to)
})

export default router
