import { shallowRef } from "vue"
import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from "pinia"
import { useLoginStore } from '@/stores/login';
import { useMenuStore } from '@/stores/menu';
// import HomeView from '../views/HomeView.vue'
import {
  Document,
  Menu as IconMenu,
  House,
  Location,
  Setting,
  } from '@element-plus/icons-vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', 
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue')
    },
    {
      path: '/',
      name: 'main',
      component: () => import('@/components/Layout.vue'),
      children: [{
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/Home.vue'),
          meta: {
            title: '首页',
            icon: shallowRef(House),
            common: true
          }
        },
        // {
        //   path: '/about',
        //   name: 'about',
        //   // route level code-splitting
        //   // this generates a separate chunk (About.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () => import('@/views/about/About.vue'),
        //   meta: {
        //     title: '关于',
        //     icon: Document,
        //     common: false
        //   }
        // },
        // {
        //   path: '/some',
        //   name: 'some',
        //   component: () => import('@/views/some/Some.vue'),
        //   meta: {
        //     title: '其他',
        //     icon: Setting,
        //     common: false
        //   }
        // },
      ]
    },
    {
      path: '/:catchAll(.*)*',
      // name: 'err404', 
      component: () => import('@/views/error/Err404.vue') 
    }
  ]
})

const dynamicRoutes = [
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/about/About.vue'),
    meta: {
      title: '关于',
      icon: shallowRef(Document),
      common: false
    }
  },
  {
    path: '/some',
    name: 'some',
    component: () => import('@/views/some/Some.vue'),
    meta: {
      title: '其他',
      icon: shallowRef(Setting),
      common: false
    }
  },
]

const vitemodules = import.meta.glob('../views/**/*.vue')
//生成动态路由
const addRoutesFn = () => {
  dynamicRoutes.forEach(r => {
    let _component = null
    for(const item in vitemodules){
      const _index = item.lastIndexOf('/')
      const filename = item.substring(_index + 1).split('.')[0]
      if(filename.toLocaleLowerCase() === r.name){
        _component = vitemodules[item]
      }
    }
    router.addRoute('main', {
      path: r.path,
      name: r.name,
      meta: r.meta,
      component: _component
    })
  })
}

//移除动态路由
const removeRoutesFn = () => {

}

router.beforeEach(async (to, from, next) => {
  const menuData = useMenuStore()
  const { menulist, mentflag } = storeToRefs(menuData)
  const userInfo = useLoginStore()
  const { logininfo } = storeToRefs(userInfo)
  if(logininfo.value && logininfo.value.authtoken){
    if(logininfo.value.usertype === 0 && !mentflag.value){
      addRoutesFn()
      await menuData.changeMenuFlag()
      next({ ...to, replace: true })
    }
    else if(logininfo.value.usertype === 1 && !mentflag.value){
      await menuData.changeMenuFlag()
      next({ ...to, replace: true })
    }
    else {
      next()
    }
  }
  else{
    if(to.meta.auth || to.matched.findIndex(p => p.path === to.path) < 0 || (menulist.value === null && to.name !== 'login') ){
      next({name: 'login'})
    }
    else {
      next()
    }
  }
});

export default router
