<template>
    <el-popover
        ref="popoverRef"
        placement="top-start"
        :width="200"
        :hide-after="10"
        trigger="click"
    >
        <div class="emoji-module">
            <el-scrollbar :height="200">
                <ul class="emoji-box">
                    <li class="emoji-item" v-for="(icon, key, index) in emojiArr" :key="index">
                        <span @click="handleItem(key)"><svg-icon :icon-class="icon"></svg-icon></span>
                    </li>
                </ul>
            </el-scrollbar>
        </div>
        <template #reference>
            <el-button class="input-icon"
                       size="small"
                       type="primary"
                       circle>
                <svg-icon icon-class="expression" />
            </el-button>
        </template>
    </el-popover>
</template>

<script lang="ts">
import { Vue, Options, Emit, Ref } from "vue-property-decorator";
import emojiArr from "./emojiData";
import { ElPopover } from "element-plus";

@Options({
    name: "Emoji"
})
export default class Emoji extends Vue {
    get emojiArr() {
        return emojiArr;
    }

    @Ref("popoverRef") readonly popoverRef!: typeof ElPopover;

    @Emit("onEmojiClick")
    handleSvgItem(val: string) {
        return val;
    }

    handleItem (key: string) {
        this.popoverRef.hide();
        this.handleSvgItem(`[${key}]`);
    }
}
</script>

<style scoped lang="scss">
.emoji_module {
    width: 240px;
    height: 200px;
    overflow: hidden;
}
.emoji-box {
    display: flex;
    flex-wrap: wrap;

    .emoji-item {
        font-size: 30px;
        padding: 5px;
        line-height: 1;

        span {
            display: inline-block;
            cursor: pointer;
        }
    }
}
.input-icon {
    padding: 0;
    border: none;
}
</style>
