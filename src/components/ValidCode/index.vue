<template>
    <div
        class="valid-code-box"
        :style="`width:${width}; height:${height}`"
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
import { Options, Vue } from "vue-class-component";
import { CommonApi } from "@/api";

interface ValidCodeItem {
    code: string;
    color: string;
    fontSize: string;
    padding: string;
    transform: string;
}

@Options({
    props: {
        validCode: {
            type: String,
            default: "",
        },
        width: {
            type: String,
            default: "150px",
        },
        height: {
            type: String,
            default: "40px",
        },
        length: {
            type: Number,
            default: 4,
        },
        refresh: {
            type: Number,
            default: 0,
        },
    },
    watch: {
        refresh() {
            this.getCode();
        },
    },
})
export default class ValidCode extends Vue {
    public codeList: Array<ValidCodeItem> = [];

    public getCode() {
        CommonApi.getValidCode()
            .then((res) => {
                this.createCode(res.data.validCode);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    private createCode(codeArr: string[]) {
        let codeList: Array<ValidCodeItem> = [];
        // 生成
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
        // 指向
        this.codeList = codeList;
        // 将当前数据派发出去
        this.$emit(
            "update:validCode",
            codeList.map((item: ValidCodeItem) => item.code).join("")
        );
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
