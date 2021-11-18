<template>
    <el-color-picker v-model="themeColor" @change="changeTheme" />
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { setTheme, themeColor } from "@/utils/theme.ts";

@Options({})
export default class ThemePicker extends Vue {
    // 默认颜色
    private defaultColor = "#409eff";

    // 主题颜色
    themeColor = themeColor || this.defaultColor;

    /**
     * @description: 更改主题
     * @param {String} color 颜色
     */
    changeTheme(color: any) {
        color || (color = this.themeColor = this.defaultColor);
        setTheme(color);
    }
}
</script>

<style scoped></style>
