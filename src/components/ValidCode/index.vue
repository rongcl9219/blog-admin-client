<template>
    <div
        class="valid-code-box"
        :style="`width:${width}px; height:${height}px`"
        @click="getCode"
    >
        <span
            v-for="(item, index) in codeList"
            :key="index"
            :style="getStyle(item)"
            >{{ item.code }}</span
        >
    </div>
</template>

<script lang="ts">
import { Vue, Options, Prop, Watch, Emit } from "vue-property-decorator";
import { CommonApi } from "@/api";

interface ValidCodeItem {
    code: string;
    color: string;
    fontSize: string;
    padding: string;
    transform: string;
}

@Options({
    name: "ValidCode"
})
export default class ValidCode extends Vue {
    @Prop({ type: String, default: "" }) validCode: string;
    @Prop({ type: Number, default: 150 }) width: number;
    @Prop({ type: Number, default: 40 }) height: number;
    @Prop({ type: Number, default: 4 }) length: number;
    @Prop({ type: Number, default: 0 }) refresh: number;

    @Watch("refresh")
    onRefreshChanged() {
        this.getCode();
    }

    public codeList: Array<ValidCodeItem> = [];

    public getCode() {
        CommonApi.getValidCode()
            .then((res) => {
                this.createCode(res.data.validCode);
            })
            .catch();
    }

    private createCode(codeArr: string[]) {
        let codeList: Array<ValidCodeItem> = [];

        codeArr.forEach((code: string) => {
            const rgb = [
                Math.round(Math.random() * 200),
                Math.round(Math.random() * 220),
                Math.round(Math.random() * 200),
            ];
            codeList.push({
                code: code,
                color: `rgb(${rgb})`,
                fontSize: `${10 + (+[Math.floor(Math.random() * 10)] + 6)}px`,
                padding: `${[Math.floor(Math.random() * 10)]}px`,
                transform: `rotate(${
                    Math.floor(Math.random() * 90) -
                    Math.floor(Math.random() * 90)
                }deg)`,
            });
        });

        this.codeList = codeList;

        this.onValidCodeChanged();
    }

    // 将当前数据派发出去
    @Emit("update:validCode")
    onValidCodeChanged() {
        return this.codeList.map((item: ValidCodeItem) => item.code).join("");
    }

    public getStyle(data: any) {
        return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`;
    }

    mounted() {
        this.getCode();
    }
}
</script>

<style scoped>
.valid-code-box {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 150px;
    background-color: rgba(204, 204, 204, 0.3);
    border-radius: 5px;
    user-select: none;
    cursor: pointer;
}
.valid-code-box span {
    display: inline-block;
}
</style>
