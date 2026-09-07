import { markRaw } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/stores/login'
import { useMenuStore } from '@/stores/menu'

import {
  Document,
  House,
  Setting,
} from '@element-plus/icons-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. 登录页
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue')
    },
    
    // 2. 主布局 (Layout) 及其子路由
    {
      path: '/',
      name: 'main',
      component: () => import('@/components/Layout.vue'),
      redirect: '/home', // 优化：访问根路径 '/' 时，默认重定向到首页 '/home'
      children: [
        {
          // 优化：子路由推荐使用相对路径 'home' 而不是绝对路径 '/home'
          path: 'home', 
          name: 'home',
          component: () => import('@/views/home/Home.vue'),
          meta: {
            title: '首页',
            icon: markRaw(House),
            common: true
          }
        }
      ]
    },
    
    // 3. 404 错误页
    {
      path: '/:catchAll(.*)*',
      name: 'err404', 
      component: () => import('@/views/error/Err404.vue') 
    }
  ]
})

// 预定义动态路由的元信息
const dynamicRoutes = [
  {
    path: '/about',
    name: 'about',
    meta: {
      title: '关于',
      icon: markRaw(Document),
      common: false
    }
  },
  {
    path: '/some',
    name: 'some',
    meta: {
      title: '其他',
      icon: markRaw(Setting),
      common: false
    }
  },
]

const viewModules = import.meta.glob('../views/**/*.vue')
let removeRouteFns = []

// 生成动态路由
const addRoutesFn = () => {
  dynamicRoutes.forEach(route => {
    const modulePath = Object.keys(viewModules).find(path =>
      path.toLowerCase().endsWith(`/${route.name.toLowerCase()}.vue`)
    )

    if (modulePath) {
      const removeRoute = router.addRoute('main', {
        path: route.path,
        name: route.name,
        meta: route.meta,
        component: viewModules[modulePath]
      })
      if (removeRoute) {
        removeRouteFns.push(removeRoute)
      }
    }
  })
}

// 移除动态路由
const removeRoutesFn = () => {
  removeRouteFns.forEach(remove => remove())
  removeRouteFns = []
}

// 路由全局前置守卫
router.beforeEach(async (to, from, next) => {
  const loginStore = useLoginStore()
  const menuStore = useMenuStore()

  const { logininfo } = storeToRefs(loginStore)
  const { menuflag } = storeToRefs(menuStore)

  const isAuthenticated = logininfo.value?.authtoken

  if (isAuthenticated) {
    // 【已登录】：处理动态路由加载和菜单状态
    if (!menuflag.value) {
      if (logininfo.value.usertype === 0) {
        addRoutesFn()
      }
      await menuStore.changeMenuFlag()
      next({ ...to, replace: true })
    } else {
      next()
    }
  } else {
    // 【未登录】：拦截所有非 login 页面的访问
    // 修复：将原本写在 routes 里的 redirect 逻辑移到这里
    if (to.name !== 'login') {
      next({ name: 'login' })
    } else {
      next()
    }
  }
})

export { removeRoutesFn }
export default router