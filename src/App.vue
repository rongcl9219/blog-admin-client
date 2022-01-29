<template>
    <el-config-provider :locale="locale">
        <router-view />
    </el-config-provider>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { initTheme } from "@/utils/theme.ts";
import zhCn from "element-plus/es/locale/lang/zh-cn";

@Options({})
export default class App extends Vue {
    get locale() {
        return zhCn;
    }

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
