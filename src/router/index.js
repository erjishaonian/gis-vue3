import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  //农业gis
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
  },
  {
    path: '/gis',
    name: 'gis',
    component: () => import('../views/gis/Gis.vue'),
  },
  //贰年的组件库
  {
    path: '/ernian',
    name: 'ernian',
    component: () => import('../views/ernian/index.vue'),
    meta: {
      // 添加路由元信息
      topStyle: {
        color: '#000000',
        background: '#42b983',
        keep: 'none'
      },
      topMenu: {
        title: '贰年的 vue3 组件库',
        url: '/',
        list: [{
          name: '快速上手',
          url: '/'
        },{
          name: '组件',
          url: '/'
        }],
        loinShow: false
      }
    },
    children: [
      {
        path: '/',
        component: () => import('../views/ernian/pages/Button.vue')
      },
      {
        path: '/button',
        component: () => import('../views/ernian/pages/Button.vue')
      }
    ]
  },
  //测试页面
  {
    path: '/aboutView',
    name: 'aboutView',
    component: () => import('../views/AboutView.vue')
  },
  //组件页面
  {
    path: '/homeView',
    name: 'homeView',
    component: () => import('../views/HomeView.vue')
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
