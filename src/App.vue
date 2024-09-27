<script setup>
import { onUnmounted } from 'vue';
//  window.addEventListener('beforeunload', () => {
//     sessionStorage.clear()
//     localStorage.clear()
//   })
//   window.addEventListener("unload", () => { //部分手机可以获取到
 
//     let blob = new Blob([JSON.stringify(params)], {
//       type: 'application/json',
//     });

//     navigator.sendBeacon(window.location.origin+'请求路径',blob);
//   })
//   window.addEventListener("pagehide", () => {
//     clearInterval(timer)
//     let blob = new Blob([JSON.stringify(params)], {
//       type: 'application/json',
//     });
//     localStorage.setItem('pagehide','pagehide')
//     navigator.sendBeacon(window.location.origin+'请求路径',blob);
//   },false);
//   document.addEventListener("visibilitychange", () => {
//     clearInterval(timer)
//     let blob = new Blob([JSON.stringify(params)], {
//       type: 'application/json',
//     });
//     localStorage.setItem('visibilitychange','visibilitychange')
//     navigator.sendBeacon(window.location.origin+'请求路径',blob);
//   })
//   window.addEventListener("visibilitychange", () => {

//     let blob = new Blob([JSON.stringify(params)], {
//       type: 'application/json',
//     });
//     localStorage.setItem('winvisibilitychange','visibilitychange')
//     navigator.sendBeacon(window.location.origin+'请求路径',blob);
//   })
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
