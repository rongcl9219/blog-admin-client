<template>
    <div class="sidebar-container">
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="defaultPath"
                :collapse="isSidebarOpen"
                :unique-opened="false"
                :collapse-transition="false"
                :router="true"
                mode="vertical">
                <el-menu-item index="/main" :class="{'submenu-title-noDropdown': isSidebarOpen}">
                    <i class="el-icon-third-shouye"></i>
                    <template #title>
                        <span>主页</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/class" :class="{'submenu-title-noDropdown': isSidebarOpen}">
                    <i class="el-icon-third-fenleiguanli"></i>
                    <template #title>
                        <span>分类管理</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/tag" :class="{'submenu-title-noDropdown': isSidebarOpen}">
                    <i class="el-icon-third-biaoqian"></i>
                    <template #title>
                        <span>标签管理</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/article" :class="{'submenu-title-noDropdown': isSidebarOpen}">
                    <i class="el-icon-third-svgwrite"></i>
                    <template #title>
                        <span>文章管理</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/webInfo" :class="{'submenu-title-noDropdown': isSidebarOpen}">
                    <i class="el-icon-third-xin"></i>
                    <template #title>
                        <span>网站信息</span>
                    </template>
                </el-menu-item>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Getter } from "vuex-class";

@Options({})
export default class SideBar extends Vue {
    @Getter("setting/getSidebarOpen") isSidebarOpen: any;

    get defaultPath() {
        return this.$route.path;
    }
}
</script>

<style lang="scss">
@import "@/style/sidebar.scss";
</style>
