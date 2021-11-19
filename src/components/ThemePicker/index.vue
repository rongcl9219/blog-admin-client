<template>
    <div class="choose-theme">
        <el-icon class="el-icon-third-theme"></el-icon>
        <el-color-picker
            class="theme-picker"
            v-model="themeColor"
            @change="changeTheme"
        />
    </div>
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

<style lang="scss">
.choose-theme {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    color: var(--el-color-primary);

    .el-icon-third-theme {
        font-size: 24px;
    }

    .theme-picker {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }
}
</style>
