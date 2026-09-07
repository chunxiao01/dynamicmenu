import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('loginstore', () => {
  const logininfo = ref({
    username: null,
    usertype: null,
    authtoken: null
  })
  async function logininfoclean(){
    logininfo.value = {
      username: null,
      usertype: null,
      authtoken: null
    }
  }
  async function getlogininfo(data) {
    logininfo.value.username = data.username
    logininfo.value.usertype = data.usertype
    logininfo.value.authtoken = data.authtoken
  }
  async function logout() {
    // 1. 调用后端登出接口 (可选)
    // 2. 清理本地 token 和 store 数据
    this.logininfo = null
    // 3. 清理路由
    removeRoutesFn()
    // 4. 跳转
    router.push({ name: 'login' })
  }
  return { logininfo, getlogininfo, logininfoclean, logout }
}, {
    persist:{
        paths: ['logininfo'],
        storage: sessionStorage,
    }
})
