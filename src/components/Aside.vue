<script setup>
    import { ref, computed } from "vue"
    import { useRouter } from "vue-router";
    //动态菜单
    const router = useRouter()
    // const menus = computed(()=> {
    //     let menu = router.options.routes.filter(item => item.children)
    //     console.log(15, menu[0].children)
    //     let _menu = menu[0].children.filter(item => item.meta.common)
    //     return _menu
    // })
    const currentMenu = computed(()=>{
        return router.currentRoute.value.path
    })
    defineProps({
        menus: {
            type: Array,
            default: []
        }
    })
</script>

<template>
    <h5 class="mb-2">系统菜单</h5>
    <el-menu
        :default-active="currentMenu"
        class="el-menu-vertical-demo"
        router
    >
        <template v-for="submenu in menus" :key="submenu.path">
            <el-sub-menu v-if="submenu.children" :index="submenu.path">
                <template #title>
                    <el-icon><component :is="submenu.meta.icon" /></el-icon>
                    <span>{{ submenu.meta.title }}</span>
                </template>
                <template v-for="menu in submenu.children" :key="menu.path">
                    <el-menu-item :index="menu.path">
                        <el-icon><component :is="menu.meta.icon" /></el-icon>
                        <template #title>
                            <span>{{ menu.meta.title }}</span>
                        </template>
                    </el-menu-item>
                </template>
            </el-sub-menu>
            <el-menu-item v-else :index="submenu.path">
                <!--<el-icon><component :is="submenu.meta.icon" /></el-icon>-->
                <template #title>
                    <span>{{ submenu.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
    </el-menu>
</template>
  
<style>
    .el-menu--horizontal {
    --el-menu-horizontal-height: 100px;
    }
</style>