<template>
    <div class="app-main">
        <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </transition>
        </router-view>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";

@Options({
    name: "AppMain"
})
export default class AppMain extends Vue {
    get key() {
        return this.$route.path;
    }
}
</script>

<style scoped lang="scss">
.app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}

.fixed-header + .app-main {
    box-sizing: border-box;
    padding: 65px 15px 15px;
}
</style>
