import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'ToolsList',
    component: () => import('../views/ToolsList.vue'),
    meta: {
      title: '开发工具箱',
      hideInMenu: true
    }
  },
  // JSON 格式化
  {
    path: '/json/format',
    name: 'JsonFormat',
    component: () => import('../views/json/JsonFormat.vue'),
    meta: {
      title: 'JSON 格式化',
      hideInMenu: false
    }
  },
  // SQL 数据填充
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
