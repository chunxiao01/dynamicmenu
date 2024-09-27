import { ref, computed, shallowRef } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import {
  Document,
  Menu as IconMenu,
  House,
  Location,
  Setting,
  } from '@element-plus/icons-vue'
import { useLoginStore } from '@/stores/login';

export const useMenuStore = defineStore('menustore', () => {
  const menulist = ref(null)
  const mentflag = ref(false)
  const userInfo = useLoginStore()
  const { logininfo } = storeToRefs(userInfo)
  async function menuInfoClean() {
    menulist.value = null
    mentflag.value = false
  }
  async function getmenulist(){
    if(logininfo.value.authtoken && logininfo.value.usertype === 0){
      menulist.value = [{
            path: '/home',
            name: 'home',
            component: () => import('@/views/home/Home.vue'),
            meta: {
              title: '首页',
              icon: shallowRef(House),
              common: true
            }
          },{
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
          },]
    }
    else if(logininfo.value.authtoken && logininfo.value.usertype === 1){
      menulist.value = [{
            path: '/home',
            name: 'home',
            meta: {
              title: '首页',
              icon: shallowRef(House),
              common: true
            }
          }]
    }
    else{
      menulist.value = []
    }
  }
  async function changeMenuFlag(){
    mentflag.value = !mentflag.value
  }
  return { menulist, mentflag, getmenulist, changeMenuFlag, menuInfoClean }
}, {
  persist: {
    pick: ['menulist'],
    storage: sessionStorage,
  }
})
