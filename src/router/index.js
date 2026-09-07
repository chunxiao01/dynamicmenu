import { markRaw, defineComponent, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import { useMenuStore } from '@/stores/menu'
import { Document, House, Setting } from '@element-plus/icons-vue'

// ---------- 常量 ----------
const ROUTE_NAMES = {
  LOGIN: 'login',
  MAIN: 'main',
  HOME: 'home',
  NOT_FOUND: 'not-found',
}

// ---------- 路由配置 ----------
// 静态路由（始终存在）
const staticRoutes = [
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/',
    name: ROUTE_NAMES.MAIN,
    component: () => import('@/components/Layout.vue'),
    children: [
      {
        path: '/home',
        name: ROUTE_NAMES.HOME,
        component: () => import('@/views/home/Home.vue'),
        meta: { title: '首页', icon: markRaw(House), common: true },
      },
    ],
  },
]

// 动态路由定义（按用户类型分组）
const dynamicRouteConfigs = {
  // usertype = 0 时加载的路由
  0: [
    { path: '/about', name: 'about', meta: { title: '关于', icon: markRaw(Document) } },
    { path: '/some', name: 'some', meta: { title: '其他', icon: markRaw(Setting) } },
  ],
  // 可扩展其他 usertype
  // 1: [ ... ],
}

// 404 路由（动态添加，始终放在最后）
const notFoundRoute = {
  path: '/:catchAll(.*)*',
  name: ROUTE_NAMES.NOT_FOUND,
  component: () => import('@/views/error/Err404.vue'),
}

// 所有视图组件映射（用于动态加载时按名称查找）
const viewModules = import.meta.glob('../views/**/*.vue')

// ---------- 路由实例 ----------
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
})

// ---------- 动态路由管理 ----------
let dynamicLoaded = false

/**
 * 根据 usertype 添加动态路由
 */
function addDynamicRoutes(usertype) {
  const routes = dynamicRouteConfigs[usertype] || []
  routes.forEach(route => {
    // 避免重复添加
    if (router.hasRoute(route.name)) return

    // 根据路由名查找对应的 .vue 文件
    const modulePath = Object.keys(viewModules).find(path =>
      path.toLowerCase().endsWith(`/${route.name.toLowerCase()}.vue`)
    )
    if (!modulePath) {
      console.warn(`[router] 未找到动态路由组件：${route.name}`)
      return
    }

    // 作为 main 的子路由添加
    router.addRoute(ROUTE_NAMES.MAIN, {
      path: route.path,
      name: route.name,
      meta: route.meta,
      component: viewModules[modulePath],
    })
  })
}

/**
 * 移除所有动态路由（用于登出等场景）
 */
export function removeDynamicRoutes() {
  const allRoutes = router.getRoutes()
  // 收集所有动态路由名称（从配置中）
  const dynamicNames = Object.values(dynamicRouteConfigs).flat().map(r => r.name)
  dynamicNames.forEach(name => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
  // 移除 404
  if (router.hasRoute(ROUTE_NAMES.NOT_FOUND)) {
    router.removeRoute(ROUTE_NAMES.NOT_FOUND)
  }
  dynamicLoaded = false
}

/**
 * 确保动态路由和 404 已加载
 */
function ensureRoutesLoaded(usertype) {
  if (dynamicLoaded) return

  // 添加业务动态路由
  addDynamicRoutes(usertype)

  // 添加 404 路由（始终在最后）
  if (!router.hasRoute(ROUTE_NAMES.NOT_FOUND)) {
    router.addRoute(notFoundRoute)
  }

  dynamicLoaded = true
}

// ---------- 路由守卫 ----------
router.beforeEach(async (to) => {
  const loginStore = useLoginStore()
  const menuStore = useMenuStore()
  const token = loginStore.logininfo?.authtoken

  // 1. 登录页直接放行
  if (to.path === '/login') {
    return true
  }

  // 2. 未登录：跳转登录页
  if (!token) {
    // 根路径不带 redirect，其他路径带 redirect 以便登录后回跳
    const redirect = to.path === '/' ? undefined : to.fullPath
    return { name: ROUTE_NAMES.LOGIN, query: redirect ? { redirect } : {}, replace: true }
  }

  // 3. 已登录访问根路径 → 重定向到首页
  if (to.path === '/') {
    return { name: ROUTE_NAMES.HOME, replace: true }
  }

  // 4. 首次加载动态路由（只执行一次）
  if (!dynamicLoaded) {
    // 根据用户类型加载对应动态路由
    ensureRoutesLoaded(loginStore.logininfo?.usertype)

    // 初始化菜单（如果未加载）
    if (!menuStore.menuflag) {
      try {
        await menuStore.changeMenuFlag()
      } catch (error) {
        console.error('菜单初始化失败:', error)
        // 可根据业务决定是否继续导航，这里选择继续
      }
    }

    // 重新导航到当前路径，确保动态路由生效（使用 replace 避免历史记录堆积）
    return { path: to.fullPath, replace: true }
  }

  // 5. 所有校验通过，放行
  return true
})

// ---------- 导出 ----------
export default router
export { removeDynamicRoutes as removeRoutesFn }