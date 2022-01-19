<template>
    <el-dialog
        title="图片上传"
        v-model="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :append-to-body="true"
        @close="closeUpLoadImg"
        width="640px">
        <div v-loading="isUpload">
            <el-upload
                ref="uploadImage"
                action="/api/file/uploadImage"
                accept=".jpg, .jpeg, .png"
                :show-file-list="false"
                list-type="picture"
                name="file"
                :limit="limit"
                :multiple="limit > 1"
                :file-list="fileList"
                :on-exceed="overRange"
                :auto-upload="false">
                <div class="el-upload el-upload--picture-card upload_btn" :style="imgStyle">
                    <el-icon><Plus /></el-icon>
                </div>
                <div class="list_item" :style="imgStyle" v-for="(item, index) in fileList" :key="index">
                    <div class="list_content">
                        <img :style="imgStyle" :src="item.url" alt="">
                        <div class="preview_box">
                            <el-button type="text" icon="el-icon-view" class="preview_img_icon"></el-button>
                            <img class="preview_img" :style="imgStyle" :src="item.url" alt="">
                        </div>
                    </div>
                    <el-button type="danger" icon="el-icon-circle-close" class="remove_img" circle></el-button>
                </div>
            </el-upload>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeUpLoadImg">取 消</el-button>
                <el-button type="primary" @click="submitUpload">上 传</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import {Vue, Options, Prop, Ref, Emit, Watch} from "vue-property-decorator";
import { Md5 } from "ts-md5/dist/md5";
// import { CommonApi } from "@/api";
import { getUuid } from "@/utils/tool";
import { Plus } from "@element-plus/icons";
import {ElUpload} from "element-plus";

@Options({
    components: {
        Plus
    }
})
export default class UploadImage extends Vue {
    @Prop({ default: false }) uploadImgVisible: boolean;
    @Prop({ default: [] }) imgList: Array<any>;
    @Prop({ default: 200 }) imgWidth: number;
    @Prop({ default: 200 }) imgHeight: number;
    @Prop({ default: "" }) thumbnail: string;
    @Prop({ default: 1 }) limitNum: number;

    @Ref() readonly uploadImageRef!: typeof ElUpload;

    @Watch("uploadImgVisible")
    onUploadAvatarVisible(val: boolean) {
        this.dialogVisible = val;
    }

    @Emit("image-upload-success")
    onCropUploadSuccess(fileObj: any) {
        return fileObj;
    }
    @Emit("image-upload-fail")
    onCropUploadFail(error: any) {
        return error;
    }
    @Emit("update:uploadImgVisible")
    onUploadImgVisibleChanged(visible: boolean) {
        return visible;
    }

    public dialogVisible:boolean = false;

    get imgStyle() {
        let width = this.imgWidth;
        width = width < 50 ? 50 : width > 240 ? 240 : width;
        let height = this.imgHeight
        height = height < 50 ? 50 : height > 240 ? 240 : height;
        return {
            width: width + 'px',
            height: height + 'px'
        }
    }

    get limit() {
        return this.limitNum < 1 ? 1 : this.limitNum;
    }

    public isUpload: boolean = false;
    public fileList: Array<any> = [];

    /**
     * 上传
     */
    submitUpload() {
        if (this.isUpload) {
            return false;
        }
        this.isUpload = true;
    }
    /**
     * 判断文件是否是图片
     * @param ext 文件后缀
     */
    isAssetTypeAnImage(ext: string) {
        return [
            'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1
    }
    closeUpLoadImg () {
        this.fileList = [];
        // 清除选择列表
        this.uploadImageRef.clearFiles();
        this.onUploadImgVisibleChanged(false);
    }
    overRange () {
        this.$msg.warning(`一次最多上传 ${this.limit} 张图片`)
    }
    removeImage (file: any, fileList: Array<any>) {
        return fileList.filter(item => {
            return item.uid !== file.uid;
        });
    }
    initImageData () {
        return new Promise((resolve) => {
            let fileObj: any = {};
            let keys: string[] = [];
            this.fileList.map(file => {
                //  用FormData存放上传文件
                let formData = new FormData();
                let key = Md5.hashStr(getUuid());
                formData.append('file', file.raw, key);
                formData.append('key', key);
                keys.push(key);
                fileObj[key] = formData;
            });
            let keysStr = keys.join(',');
            resolve({fileObj, keysStr})
        });
    }
    mergePromise (ajaxArray: any) {
        let p: any = Promise.resolve();
        let arr: Array<any> = [];
        ajaxArray.map((promise: any) => {
            p = p.then(promise).then((data: any) => {
                arr.push(data);
                return arr;
            });
        });
        return p;
    }
}
</script>

<style scoped>

</style>
