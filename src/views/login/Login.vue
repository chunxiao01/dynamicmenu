<script setup>
import { useRouter } from 'vue-router';

import { storeToRefs } from "pinia"
import { useLoginStore } from '@/stores/login';
import { useMenuStore } from '@/stores/menu';

const router = useRouter()
const loginAdminFn = async () => {
    const loginInfo = useLoginStore()
    await loginInfo.logininfoclean()
    sessionStorage.clear()
    localStorage.clear()
    await loginInfo.getlogininfo({
        username: 'admin',
        usertype: 0,
        authtoken: 'admin123456'
    })
    const menuInfo = useMenuStore()
    await menuInfo.menuInfoClean()
    await menuInfo.getmenulist()
    router.push('/home')
}
const loginFn = async () => {
    const loginInfo = useLoginStore()
    await loginInfo.logininfoclean()
    sessionStorage.clear()
    localStorage.clear()
    await loginInfo.getlogininfo({
        username: 'user',
        usertype: 1,
        authtoken: 'user123456'
    })
    const menuInfo = useMenuStore()
    await menuInfo.menuInfoClean()
    await menuInfo.getmenulist()
    router.push('/home')
}
</script>

<template>
    <div class="login">
        <el-button type="primary" plain @click="loginAdminFn">管理员登录</el-button>
        <el-button type="primary" plain @click="loginFn">用户登录</el-button>
    </div>
  </template>

<style>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}
</style>