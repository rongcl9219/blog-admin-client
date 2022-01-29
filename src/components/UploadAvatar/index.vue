<template>
    <el-dialog
        title="上传头像"
        width="600px"
        v-model="dialogVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :append-to-body="true"
        @closed="closeUpLoadImg"
    >
        <template #default>
            <div class="img-copper-wrapper">
                <el-row type="flex">
                    <el-col :span="17">
                        <div class="img-copper-left">
                            <div class="img-copper-con">
                                <img
                                    class="img-copper-img"
                                    ref="uploadImg"
                                    draggable="false"
                                    :src="sourceImgUrl"
                                    :style="sourceImgStyle"
                                    @drag="preventDefault"
                                    @dragstart="preventDefault"
                                    @dragend="preventDefault"
                                    @dragleave="preventDefault"
                                    @dragover="preventDefault"
                                    @dragenter="preventDefault"
                                    @drop="preventDefault"
                                    @mousedown="imgStartMove"
                                    @mousemove="imgMove"
                                    @mouseup="createImg"
                                    @mouseout="createImg"
                                    alt=""
                                />
                                <div
                                    :style="sourceImgShadeStyle"
                                    class="
                                        img-copper-img-shade
                                        img-copper-img-shade-1
                                    "
                                />
                                <div
                                    :style="sourceImgShadeStyle"
                                    class="
                                        img-copper-img-shade
                                        img-copper-img-shade-2
                                    "
                                />
                            </div>
                            <div class="img-copper-range" v-show="rangeShow">
                                <input
                                    class="img-copper-scale-input"
                                    :value="scale.range"
                                    type="range"
                                    step="1"
                                    min="0"
                                    max="100"
                                    @input="zoomChange"
                                />
                                <i
                                    class="img-copper-scale-down"
                                    @mousedown="startZoomSub"
                                    @mouseout="endZoomSub"
                                    @mouseup="endZoomSub"
                                />
                                <i
                                    class="img-copper-scale-plus"
                                    @mousedown="startZoomAdd"
                                    @mouseout="endZoomAdd"
                                    @mouseup="endZoomAdd"
                                />
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="img-copper-right">
                            <div class="size-one">
                                <el-avatar shape="square" :size="100">
                                    <img :src="createImgUrl" alt="" />
                                </el-avatar>
                                <span>方形预览</span>
                            </div>
                            <div class="size-two">
                                <el-avatar :size="100">
                                    <img :src="createImgUrl" alt="" />
                                </el-avatar>
                                <span>圆形预览</span>
                            </div>
                            <div class="upload-avatar">
                                <input
                                    v-show="false"
                                    ref="fileInput"
                                    type="file"
                                    @change="fileChange"
                                />
                                <el-button
                                    size="small"
                                    type="primary"
                                    @click.prevent="handleClick"
                                >上传
                                </el-button
                                >
                                <el-button
                                    style="margin-left: 5px"
                                    size="small"
                                    type="success"
                                    @click.prevent="submitUpload"
                                >
                                    确定
                                </el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <canvas
                    v-show="false"
                    ref="canvas"
                    :width="width"
                    :height="height"
                />
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Options, Prop, Ref, Emit, Watch } from "vue-property-decorator";
import { Md5 } from "ts-md5/dist/md5";
import { CommonApi } from "@/api";
import { Close } from "@element-plus/icons-vue";

interface Scale {
    zoomAddOn: boolean; // 按钮缩放事件开启
    zoomSubOn: boolean; // 按钮缩放事件开启
    range: number; // 最大100
    rotateLeft: boolean; // 按钮向左旋转事件开启
    rotateRight: boolean; // 按钮向右旋转事件开启
    x: number;
    y: number;
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
    minWidth: number; // 最宽
    minHeight: number;
    naturalWidth: number; // 原宽
    naturalHeight: number;
    sourceImgMouseDown?: any;
}

interface SourceImgMouseDown {
    on: boolean;
    mX: number; // 鼠标按下的坐标
    mY: number;
    x: number; // scale原图坐标
    y: number;
}

@Options({
    name: "UploadAvatar",
    components: {
        Close
    }
})
export default class UploadAvatar extends Vue {
    @Prop({ default: false }) uploadAvatarVisible: boolean;
    @Prop({ default: 200 }) width: number;
    @Prop({ default: 200 }) height: number;
    @Prop({ default: "" }) thumbnail: string;

    @Ref() readonly fileInput!: HTMLInputElement;
    @Ref() readonly canvas!: HTMLCanvasElement;

    @Emit("crop-upload-success")
    onCropUploadSuccess(fileObj: any) {
        return fileObj;
    }

    @Emit("crop-upload-fail")
    onCropUploadFail(error: any) {
        return error;
    }

    @Emit("update:uploadAvatarVisible")
    onUploadAvatarVisibleChanged(visible: boolean) {
        return visible;
    }

    @Watch("uploadAvatarVisible")
    onUploadAvatarVisible(val: boolean) {
        this.dialogVisible = val;
    }

    public dialogVisible: boolean = false;
    public fileList: Array<any> = [];
    public sourceImgContainer = {
        // sic
        width: 300,
        height: 240 // 如果生成图比例与此一致会出现bug，先改成特殊的格式吧，哈哈哈
    };
    public scale: Scale = {
        zoomAddOn: false,
        zoomSubOn: false,
        range: 1,
        rotateLeft: false,
        rotateRight: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        maxWidth: 0,
        maxHeight: 0,
        minWidth: 0,
        minHeight: 0,
        naturalWidth: 0,
        naturalHeight: 0
    };
    // 原图片拖动事件初始值
    public sourceImgMouseDown: SourceImgMouseDown = {
        on: false,
        mX: 0, // 鼠标按下的坐标
        mY: 0,
        x: 0, // scale原图坐标
        y: 0
    };
    // 原图地址、生成图片地址
    public sourceImg: any = null;
    public sourceImgUrl: any = "";
    public createImgUrl: any = "";

    // 原图样式
    get sourceImgStyle() {
        const { scale, sourceImgMasking } = this;
        const top = scale.y + sourceImgMasking.y + "px";
        const left = scale.x + sourceImgMasking.x + "px";
        return {
            top,
            left,
            width: scale.width + "px",
            height: scale.height + "px"
        };
    }

    // 原图蒙版属性
    get sourceImgMasking() {
        const { width, height, ratio, sourceImgContainer } = this;
        const sic = sourceImgContainer;
        const sicRatio = sic.width / sic.height; // 原图容器宽高比
        let x = 0;
        let y = 0;
        let w = sic.width;
        let h = sic.height;
        let scale = 1;
        if (ratio < sicRatio) {
            scale = sic.height / height;
            w = sic.height * ratio;
            x = (sic.width - w) / 2;
        }
        if (ratio > sicRatio) {
            scale = sic.width / width;
            h = sic.width / ratio;
            y = (sic.height - h) / 2;
        }
        return {
            scale, // 蒙版相对需求宽高的缩放
            x,
            y,
            width: w,
            height: h
        };
    }

    // 原图遮罩样式
    get sourceImgShadeStyle() {
        const { sourceImgMasking, sourceImgContainer } = this;
        const sic = sourceImgContainer;
        const sim = sourceImgMasking;
        const w =
            sim.width === sic.width ? sim.width : (sic.width - sim.width) / 2;
        const h =
            sim.height === sic.height
                ? sim.height
                : (sic.height - sim.height) / 2;
        return {
            width: w + "px",
            height: h + "px"
        };
    }

    get rangeShow() {
        return !!this.sourceImgUrl;
    }

    // 需求图宽高比
    get ratio() {
        const { width, height } = this;
        return width / height;
    }

    handleClick() {
        this.fileInput.click();
    }

    isAssetTypeAnImage(ext: string) {
        return ["png", "jpg", "jpeg", "gif"].indexOf(ext.toLowerCase()) !== -1;
    }

    data2blob(data: any) {
        data = data.split(",")[1];
        data = window.atob(data);
        let ia = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            ia[i] = data.charCodeAt(i);
        }
        return new Blob([ia], {
            type: "image/png"
        });
    }

    // 将文件转换成base64格式
    getBase64(file: any) {
        return new Promise(function(resolve, reject) {
            let reader = new FileReader();
            let imgResult: any;
            reader.readAsDataURL(file);
            reader.onload = function() {
                imgResult = reader.result;
            };
            reader.onerror = function(error) {
                reject(error);
            };
            reader.onloadend = function() {
                resolve(imgResult);
            };
        });
    }

    fileChange(e: InputEvent) {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const files: any = target.files;
        this.reset();
        const file: any = files[0];

        // 获取最后一个.的位置
        let index = file.name.lastIndexOf(".");
        // 获取后缀
        let ext = file.name.substr(index + 1);
        // 判断文件类型是否符合
        if (!this.isAssetTypeAnImage(ext)) {
            this.$msg.error("只能上传jpg/jpeg/png/gif文件!");
            return false;
        }
        // 判断文件大小是否符合
        if (!(file.size / 1024 / 1024 <= 5)) {
            this.$msg.error("上传文件大小不能超过5MB!");
            return false;
        }

        // 将图片地址赋值给裁剪框显示图片
        this.$nextTick(() => {
            // 无法直接读取，先转成base64格式
            this.getBase64(file).then((data) => {
                this.sourceImgUrl = data;
                this.startCrop();
            });
        });
    }

    submitUpload() {
        const uploadLoading = this.$loading({
            lock: true,
            text: "上传中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
        });

        if (!this.createImgUrl) {
            this.$msg.warning("请选择上传图片！");
            uploadLoading.close();
            return false;
        }

        const file = this.data2blob(this.createImgUrl);

        //  用FormData存放上传文件
        let formData = new FormData();
        let key = Md5.hashStr(new Date().getTime().toString());
        formData.append("file", file, key);
        formData.append("key", key);

        CommonApi.getUploadToken({ keys: key, thumbnail: this.thumbnail })
            .then((res) => {
                let data = res.data[0];
                formData.append("token", data.token);
                CommonApi.uploadImg(formData)
                    .then(() => {
                        let fileObj = {
                            key: key,
                            url: data.url
                        };
                        this.onCropUploadSuccess(fileObj);
                    })
                    .catch((error) => {
                        this.onCropUploadFail(error);
                    })
                    .finally(() => {
                        this.closeUpLoadImg();
                    });
            })
            .catch((err) => {
                this.$msg.error(err.msg || "获取上传token失败");
            })
            .finally(() => {
                uploadLoading.close();
            });
    }

    closeUpLoadImg() {
        this.onUploadAvatarVisibleChanged(false);
        this.reset();
    }

    reset() {
        this.scale = {
            zoomAddOn: false, // 按钮缩放事件开启
            zoomSubOn: false, // 按钮缩放事件开启
            range: 1, // 最大100
            rotateLeft: false, // 按钮向左旋转事件开启
            rotateRight: false, // 按钮向右旋转事件开启
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            maxWidth: 0,
            maxHeight: 0,
            minWidth: 0, // 最宽
            minHeight: 0,
            naturalWidth: 0, // 原宽
            naturalHeight: 0
        };
        // 原图片拖动事件初始值
        this.scale.sourceImgMouseDown = {
            on: false,
            mX: 0, // 鼠标按下的坐标
            mY: 0,
            x: 0, // scale原图坐标
            y: 0
        };
        this.sourceImg = null;
        this.sourceImgUrl = "";
        this.createImgUrl = "";
        this.fileList = [];
    }

    /* 图片选择区域函数绑定 */
    preventDefault(e: Event) {
        e.preventDefault();
        return false;
    }

    // 剪裁前准备工作
    startCrop() {
        const { width, height, ratio, scale, sourceImgUrl, sourceImgMasking } =
            this;
        const sim = sourceImgMasking;
        const img = new Image();
        img.src = sourceImgUrl;
        img.onload = () => {
            const nWidth = img.naturalWidth;
            const nHeight = img.naturalHeight;
            const nRatio = nWidth / nHeight;
            let w = sim.width;
            let h = sim.height;
            let x = 0;
            let y = 0;
            // 图片像素不达标
            if (nWidth < width || nHeight < height) {
                this.$msg.warning("图片像素不达标");
                return false;
            }
            if (ratio > nRatio) {
                h = w / nRatio;
                y = (sim.height - h) / 2;
            }
            if (ratio < nRatio) {
                w = h * nRatio;
                x = (sim.width - w) / 2;
            }
            scale.range = 0;
            scale.x = x;
            scale.y = y;
            scale.width = w;
            scale.height = h;
            scale.minWidth = w;
            scale.minHeight = h;
            scale.maxWidth = nWidth * sim.scale;
            scale.maxHeight = nHeight * sim.scale;
            scale.naturalWidth = nWidth;
            scale.naturalHeight = nHeight;
            this.sourceImg = img;
            this.createImg();
        };
    }

    // 鼠标按下图片准备移动
    imgStartMove(e: MouseEvent) {
        e.preventDefault();
        const { sourceImgMouseDown, scale } = this;
        const simd = sourceImgMouseDown;
        simd.mX = e.screenX;
        simd.mY = e.screenY;
        simd.x = scale.x;
        simd.y = scale.y;
        simd.on = true;
    }

    // 鼠标按下状态下移动，图片移动
    imgMove(e: MouseEvent) {
        e.preventDefault();
        const {
            sourceImgMouseDown: { on, mX, mY, x, y },
            scale,
            sourceImgMasking
        } = this;
        const sim = sourceImgMasking;
        const nX = e.screenX;
        const nY = e.screenY;
        const dX = nX - mX;
        const dY = nY - mY;
        let rX = x + dX;
        let rY = y + dY;
        if (!on) return;
        if (rX > 0) {
            rX = 0;
        }
        if (rY > 0) {
            rY = 0;
        }
        if (rX < sim.width - scale.width) {
            rX = sim.width - scale.width;
        }
        if (rY < sim.height - scale.height) {
            rY = sim.height - scale.height;
        }
        scale.x = rX;
        scale.y = rY;
    }

    // 按钮按下开始放大
    startZoomAdd() {
        const { scale } = this;
        scale.zoomAddOn = true;
        const zoom = () => {
            if (scale.zoomAddOn) {
                const range = scale.range >= 100 ? 100 : ++scale.range;
                this.zoomImg(range);
                setTimeout(function() {
                    zoom();
                }, 60);
            }
        };
        zoom();
    }

    // 按钮松开或移开取消放大
    endZoomAdd() {
        this.scale.zoomAddOn = false;
    }

    // 按钮按下开始缩小
    startZoomSub() {
        const { scale } = this;
        scale.zoomSubOn = true;
        const zoom = () => {
            if (scale.zoomSubOn) {
                const range = scale.range <= 0 ? 0 : --scale.range;
                this.zoomImg(range);
                setTimeout(function() {
                    zoom();
                }, 60);
            }
        };
        zoom();
    }

    // 按钮松开或移开取消缩小
    endZoomSub() {
        const { scale } = this;
        scale.zoomSubOn = false;
    }

    zoomChange(e: any) {
        this.zoomImg(e.target.value);
    }

    // 缩放原图
    zoomImg(newRange: number) {
        const { sourceImgMasking, scale } = this;
        const {
            maxWidth,
            maxHeight,
            minWidth,
            minHeight,
            width,
            height,
            x,
            y
        } = scale;
        const sim = sourceImgMasking;
        // 蒙版宽高
        const sWidth = sim.width;
        const sHeight = sim.height;
        // 新宽高
        const nWidth = minWidth + ((maxWidth - minWidth) * newRange) / 100;
        const nHeight = minHeight + ((maxHeight - minHeight) * newRange) / 100;
        // 新坐标（根据蒙版中心点缩放）
        let nX = sWidth / 2 - (nWidth / width) * (sWidth / 2 - x);
        let nY = sHeight / 2 - (nHeight / height) * (sHeight / 2 - y);
        // 判断新坐标是否超过蒙版限制
        if (nX > 0) {
            nX = 0;
        }
        if (nY > 0) {
            nY = 0;
        }
        if (nX < sWidth - nWidth) {
            nX = sWidth - nWidth;
        }
        if (nY < sHeight - nHeight) {
            nY = sHeight - nHeight;
        }
        // 赋值处理
        scale.x = nX;
        scale.y = nY;
        scale.width = nWidth;
        scale.height = nHeight;
        scale.range = newRange;
        setTimeout(() => {
            if (scale.range === newRange) {
                this.createImg();
            }
        }, 300);
    }

    // 生成需求图片
    createImg(e?: Event | number) {
        const {
            sourceImg,
            scale: { x, y, width, height },
            sourceImgMasking: { scale }
        } = this;
        const canvas = this.canvas;
        const ctx: any = canvas.getContext("2d");
        if (e) {
            // 取消鼠标按下移动状态
            this.sourceImgMouseDown.on = false;
        }
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.clearRect(0, 0, this.width, this.height);
        // 将透明区域设置为白色底边
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.translate(this.width * 0.5, this.height * 0.5);
        ctx.translate(-this.width * 0.5, -this.height * 0.5);
        ctx.drawImage(
            sourceImg,
            x / scale,
            y / scale,
            width / scale,
            height / scale
        );
        this.createImgUrl = canvas.toDataURL("image/png");
    }
}
</script>

<style scoped lang="scss">
.img-copper-wrapper {
    .img-copper-left {
        height: 360px;

        .img-copper-con {
            position: relative;
            width: 300px;
            height: 240px;
            margin: 0 auto;
            overflow: hidden;

            .img-copper-img {
                position: absolute;
                display: block;
                max-width: none;
                max-height: none;
                cursor: move;
                user-select: none;
            }

            .img-copper-img-shade {
                position: absolute;
                top: 0;
                background-color: rgba(241, 242, 243, 0.8);
            }

            .img-copper-img-shade-1 {
                left: 0;
            }

            .img-copper-img-shade-2 {
                right: 0;
            }
        }

        .img-copper-range {
            position: relative;
            width: 300px;
            height: 20px;
            margin: 20px auto;

            .img-copper-scale-input {
                display: block;
                padding-top: 5px;
                margin: 0 auto;
                width: 220px;
                height: 8px;
                vertical-align: top;
                background: transparent;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                cursor: pointer;

                &:focus {
                    outline: none;
                }

                &::-webkit-slider-thumb {
                    -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    -webkit-appearance: none;
                    appearance: none;
                    margin-top: -3px;
                    width: 12px;
                    height: 12px;
                    background-color: #61c091;
                    border-radius: 100%;
                    border: none;
                    -webkit-transition: 0.2s;
                    transition: 0.2s;
                }

                &::-moz-range-thumb {
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    -moz-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background-color: #61c091;
                    border-radius: 100%;
                    border: none;
                    -webkit-transition: 0.2s;
                    transition: 0.2s;
                }

                &::-ms-thumb {
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background-color: #61c091;
                    border: none;
                    border-radius: 100%;
                    -webkit-transition: 0.2s;
                    transition: 0.2s;
                }

                &:active::-moz-range-thumb {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    width: 14px;
                    height: 14px;
                }

                &:active::-ms-thumb {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    width: 14px;
                    height: 14px;
                }

                &:active::-webkit-slider-thumb {
                    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    margin-top: -4px;
                    width: 14px;
                    height: 14px;
                }

                &::-webkit-slider-runnable-track {
                    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    width: 100%;
                    height: 6px;
                    cursor: pointer;
                    border-radius: 2px;
                    border: none;
                    background-color: rgba(68, 170, 119, 0.3);
                }

                &::-moz-range-track {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    width: 100%;
                    height: 6px;
                    cursor: pointer;
                    border-radius: 2px;
                    border: none;
                    background-color: rgba(68, 170, 119, 0.3);
                }

                &::-ms-track {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    width: 100%;
                    cursor: pointer;
                    background: transparent;
                    color: transparent;
                    height: 6px;
                    border-radius: 2px;
                    border: none;
                }

                &::-ms-fill-lower {
                    background-color: rgba(68, 170, 119, 0.3);
                }

                &::-ms-fill-upper {
                    background-color: rgba(68, 170, 119, 0.15);
                }

                &:focus::-webkit-slider-runnable-track {
                    background-color: rgba(68, 170, 119, 0.5);
                }

                &:focus::-moz-range-track {
                    background-color: rgba(68, 170, 119, 0.5);
                }

                &:focus::-ms-fill-lower {
                    background-color: rgba(68, 170, 119, 0.45);
                }

                &:focus::-ms-fill-upper {
                    background-color: rgba(68, 170, 119, 0.25);
                }
            }

            .img-copper-scale-down,
            .img-copper-scale-plus {
                position: absolute;
                top: 0;
                width: 18px;
                height: 18px;
                border-radius: 100%;
                background-color: rgba(0, 0, 0, 0.08);

                &:hover {
                    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    cursor: pointer;
                    background-color: rgba(0, 0, 0, 0.14);
                }
            }

            .img-copper-scale-down {
                left: 6px;

                &::before {
                    position: absolute;
                    content: "";
                    display: block;
                    left: 3px;
                    top: 8px;
                    width: 12px;
                    height: 2px;
                    background-color: #fff;
                }
            }

            .img-copper-scale-plus {
                right: 6px;

                &::before {
                    position: absolute;
                    content: "";
                    display: block;
                    left: 3px;
                    top: 8px;
                    width: 12px;
                    height: 2px;
                    background-color: #fff;
                }

                &::after {
                    position: absolute;
                    content: "";
                    display: block;
                    top: 3px;
                    left: 8px;
                    width: 2px;
                    height: 12px;
                    background-color: #fff;
                }
            }
        }
    }

    .img-copper-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 360px;

        .size-one,
        .size-two {
            text-align: center;
            margin-bottom: 20px;
            letter-spacing: 3px;
            color: #9a9a9a;

            span {
                display: block;
                margin-top: 5px;
            }
        }
    }
}
</style>
