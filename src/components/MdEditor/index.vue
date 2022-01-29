<template>
    <MarkdownEditor :model-value="mdText"
                    :on-change="onChange"
                    :toolbars="toolbars"
                    :on-save="onContentSave"
                    :on-upload-img="onUploadImg"></MarkdownEditor>
</template>

<script lang="ts">
import { Vue, Options, Prop, Emit } from "vue-property-decorator";
import MarkdownEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { toolbarArr } from "./config";
import { Md5 } from "ts-md5";
import { getUuid } from "@/utils/tool";
import { CommonApi } from "@/api";

@Options({
    name: "MdEditor",
    components: {
        MarkdownEditor
    }
})
export default class MdEditor extends Vue {
    @Prop({ type: String, default: "" }) content: string;

    @Emit("update:content")
    onContentChange(value: string) {
        return value;
    }

    @Emit("on-save")
    onContentSave(value: string) {
        return value;
    }

    get toolbars() {
        return toolbarArr;
    }

    get mdText() {
        return this.content;
    }

    onChange(value: string) {
        this.onContentChange(value);
    }

    onUploadImg(files: FileList, callback: (urls: string[]) => void) {
        const uploadLoading = this.$loading({
            lock: true,
            text: "上传中...",
            background: "rgba(0, 0, 0, 0.7)"
        });

        this.initImageData(files).then((fileData: any) => {
            const { keysStr, fileObj } = fileData;
            return CommonApi.getUploadToken({
                keys: keysStr,
                thumbnail: ""
            }).then((res) => {
                let files = res.data;
                let uploadArr: Array<any> = [];
                files.map((file: any) => {
                    fileObj[file.key].url = file.url;
                    let formData = fileObj[file.key];
                    formData.append("token", file.token);
                    uploadArr.push(CommonApi.uploadImg(formData));
                });
                return Promise.allSettled(uploadArr).then((data: Array<any>) => {
                    callback(data.map(item => {
                        return item.value.status && fileObj[item.value.key].url;
                    }));
                });
            });
        }).catch(() => {
            this.$msg.error("上传失败");
        }).finally(() => {
            uploadLoading.close();
        });
    }

    initImageData(files: FileList) {
        return new Promise((resolve) => {
            let fileObj: any = {};
            let keys: string[] = [];
            Array.from(files).map((file) => {
                //  用FormData存放上传文件
                let formData = new FormData();
                let key = Md5.hashStr(getUuid());
                formData.append("file", file, key);
                formData.append("key", key);
                keys.push(key);
                fileObj[key] = formData;
            });
            let keysStr = keys.join(",");
            resolve({ fileObj, keysStr });
        });
    }
}
</script>

<style scoped>

</style>
