<template>
    <router-view />
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { initTheme } from "@/utils/theme.ts";

@Options({})
export default class App extends Vue {
    created() {
        initTheme();
    }
}
</script>

<style lang="scss">
@import '~@/style/mixin.scss';
*::selection {
    background: var(--el-color-primary);
}
*::-moz-selection {
    background: var(--el-color-primary);
}
*::-moz-selection {
    background: var(--el-color-primary);
}

html {
    @include scrollBar;
}
</style>
