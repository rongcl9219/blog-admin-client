<template>
    <div class="choose-theme">
        <svg-icon icon-class="theme"/>
        <el-color-picker
            v-model="themeColor"
            :predefine="predefineColors"
            @change="changeTheme"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { setTheme, themeColor } from "@/utils/theme.ts";

@Options({
    name: "ThemePicker"
})
export default class ThemePicker extends Vue {
    // 预设颜色
    predefineColors: string[] = [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "#feabba"
    ];

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

<style lang="scss">
.choose-theme {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    color: var(--el-color-primary);

    .svg-icon {
        font-size: 24px;
    }

    .el-color-picker {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }
}
</style>
