<template>
    <div class="app-wrapper" :class="classObj">
        <SideBar />
        <div class="main-container">
            <div class="fixed-header">
                <NavBar />
            </div>
            <AppMain />
            <Footer/>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Getter } from "vuex-class";
import SideBar from "./SideBar/index.vue";
import NavBar from "./NavBar/index.vue";
import AppMain from "./AppMain/index.vue";
import Footer from "./Footer/index.vue";

@Options({
    name: "AdminLayout",
    components: {
        SideBar,
        NavBar,
        AppMain,
        Footer
    }
})
export default class AdminLayout extends Vue {
    @Getter("setting/getSidebarOpen") isSidebarOpen: any;

    get classObj() {
        return {
            hideSidebar: this.isSidebarOpen,
            openSidebar: !this.isSidebarOpen
        };
    }
}
</script>

<style scoped lang="scss">
@import '~@/style/mixin.scss';

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - 210px);
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px)
}
</style>
