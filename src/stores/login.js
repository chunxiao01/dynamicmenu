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
  return { logininfo, getlogininfo, logininfoclean }
}, {
    persist:{
        paths: ['logininfo'],
        storage: sessionStorage,
    }
})
