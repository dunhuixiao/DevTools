import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '开发工具箱',
      hideInMenu: false
    }
  },
  // JSON 工具
  {
    path: '/json',
    name: 'JsonTools',
    component: () => import('../views/json/JsonTools.vue'),
    meta: {
      title: 'JSON 工具',
      hideInMenu: false
    }
  },
  // SQL 工具
  {
    path: '/sql/fill',
    name: 'SqlFill',
    component: () => import('../views/sql/SqlFill.vue'),
    meta: {
      title: 'SQL 数据填充',
      hideInMenu: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      hideInMenu: true
    }
  }
]

const router = createRouter({
  history: createWebHistory('/DevTools/'),
  routes
})

// 全局前置守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {  
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 开发工具箱`
  }
  next()
})

export default router
