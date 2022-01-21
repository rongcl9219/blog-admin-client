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
        <div>
            <el-upload
                ref="uploadImageRef"
                action="/api/file/uploadImage"
                accept=".jpg, .jpeg, .png"
                :show-file-list="false"
                list-type="picture"
                name="file"
                :limit="limit"
                :multiple="limit > 1"
                :file-list="fileList"
                :on-change="fileChange"
                :on-exceed="overRange"
                :auto-upload="false">
                <div class="list_item" :style="imgStyle" v-for="(item, index) in fileList" :key="index">
                    <div class="list_content">
                        <img :style="imgStyle" :src="item.url" alt="">
                        <div class="preview_box">
                            <el-button type="text" class="preview_img_icon">
                                <el-icon><View /></el-icon>
                            </el-button>
                            <img class="preview_img" :style="imgStyle" :src="item.url" alt="">
                        </div>
                    </div>
                    <el-button type="danger"
                               class="remove_img"
                               circle
                               @click="deleteImage(item)">
                        <el-icon><Close /></el-icon>
                    </el-button>
                </div>
                <div class="el-upload el-upload--picture-card upload_btn" :style="imgStyle">
                    <el-icon><Plus /></el-icon>
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
import { CommonApi } from "@/api";
import { getUuid } from "@/utils/tool";
import { Plus, Close, View } from "@element-plus/icons";
import { ElUpload } from "element-plus";

@Options({
    components: {
        Plus,
        Close,
        View
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
    @Emit("update:imgList")
    onUploadImgListChanged(files: Array<any>) {
        return files;
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

        this.initImageData().then((fileData: any) => {
            return CommonApi.getUploadToken({
                keys: fileData.keysStr,
                thumbnail: this.thumbnail
            }).then((res) => {
                let files = res.data;
                let uploadArr: Array<any> = [];
                files.map((file: any) => {
                    let formData = fileData.fileObj[file.key];
                    formData.append('token', file.token);
                    uploadArr.push(CommonApi.uploadImg(formData));
                    delete file.token;
                });
                return this.mergePromise(uploadArr).then((data: any) => {
                    this.onUploadImgListChanged(files);
                    this.onUploadImgVisibleChanged(false);
                    this.onCropUploadSuccess({files, data});
                });
            });
        });
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
    fileChange (file: any, fileList: Array<any>) {
        // 获取最后一个.的位置
        let index = file.name.lastIndexOf('.');
        // 获取后缀
        let ext = file.name.substr(index + 1);
        // 判断文件类型是否符合
        if (!this.isAssetTypeAnImage(ext)) {
            this.$msg.error('只能上传jpg/jpeg/png文件!');
            // 必须手动移除，不然已选择的文件还存在list中
            this.uploadImageRef.uploadFiles = this.removeImage(file, fileList);
            return false;
        }

        // 判断文件大小是否符合
        if (!(file.size / 1024 / 1024 <= 5)) {
            this.$msg.error('上传文件大小不能超过5MB!');
            // 必须手动移除，不然已选择的文件还存在list中
            this.uploadImageRef.uploadFiles = this.removeImage(file, fileList);
            return false
        }
        this.fileList = fileList;
    }
    overRange () {
        this.$msg.warning(`一次最多上传 ${this.limit} 张图片`)
    }
    deleteImage (file: any) {
        this.fileList = this.removeImage(file, this.fileList);
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
            resolve({fileObj, keysStr});
        });
    }
    mergePromise (ajaxArray: Array<any>) {
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

<style scoped lang="scss">
.upload_btn {
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0 5px 0;
    .el-icon {
        margin: 0;
    }
}

.list_item {
    float: left;
    position: relative;
    display: inline-block;
    margin: 0 5px 5px 0;
    vertical-align: bottom;
    cursor: pointer;

    .list_content {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        overflow: hidden;
    }

    .preview_box {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        width: 100%;
        height: 100%;
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0.4);
        transition: .2s;

        .preview_img_icon {
            padding: 0;
            color: #fff;
        }

        .preview_img {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
        }
    }

    .remove_img {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        padding: 0;
        min-height: auto;
        transform: translateX(30%) translateY(-30%);
    }
}

.list_item:hover {
    .preview_box {
        opacity: 1;
    }

    .remove_img {
        display: block;
    }
}
</style>
