<script setup>
import { ref } from "vue"

import Aside from './Aside.vue';
import Main from './Main.vue';

import { storeToRefs } from "pinia";
import { useMenuStore } from '@/stores/menu';

const menuData = useMenuStore()
const { menulist } = storeToRefs(menuData)

const menus = ref(menulist)

</script>


<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <Aside :menus="menus" />
      </el-aside>
      <el-container>
        <el-main>
            <Main />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>



<style scoped>
.common-layout {
    width: 100% !important;
}
</style>