<template>
    <div id="webInfo" v-loading="globalLoading" :element-loading-text="loadingText">
        <el-card class="box-card" shadow="hover">
            <el-form ref="webInfoFormRef" :model="form" label-width="100px" label-suffix=":">
                <el-form-item label="网站名称">
                    <el-input v-model="form.webUser"></el-input>
                </el-form-item>
                <el-form-item label="座右铭">
                    <el-input v-model="form.motto"></el-input>
                </el-form-item>
                <el-form-item label="github地址">
                    <el-input v-model="form.githubLink"></el-input>
                </el-form-item>
                <el-form-item label="个人头像">
                    <template v-if="form.avatar.url">
                        <ViewImage :images="[form.avatar]" ref="viewImageAvatarRef">
                            <template #default="scope">
                                <div class="avatar_item" v-for="(item, index) in scope.images" :key="index">
                                    <img :src="item.url" alt="">
                                </div>
                            </template>
                        </ViewImage>
                    </template>
                    <el-button class="upload_avatar_btn" @click="uploadAvatarVisible = true">
                        <el-icon><Plus /></el-icon>
                    </el-button>
                </el-form-item>
                <el-form-item label="网站banner">
                    <ViewImage :images="form.webBanner" ref="viewImageWebBannerRef">
                        <template #default="scope">
                            <div class="avatar_item" v-for="(item, index) in scope.images" :key="index">
                                <img :src="item.url" alt="">
                            </div>
                        </template>
                    </ViewImage>
                    <el-button class="upload_avatar_btn" @click="upLoadImgVisible = true">
                        <el-icon><Plus /></el-icon>
                    </el-button>
                </el-form-item>
                <el-form-item label="个人简介">
                    <el-input type="textarea" v-model="form.personalDesc"></el-input>
                </el-form-item>
                <el-form-item label="网站简介">
                    <el-input type="textarea" v-model="form.webDesc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <upload-avatar
            thumbnail="avatar"
            @crop-upload-success="uploadAvatarSuccess"
            @crop-upload-fail="uploadAvatarFail"
            v-model:upload-avatar-visible="uploadAvatarVisible"
        ></upload-avatar>

        <UploadImage v-model:imgList="form.webBanner"
                     v-model:uploadImgVisible="upLoadImgVisible"
                     :imgWidth="100"
                     :imgHeight="100"
                     :limitNum="1"></UploadImage>
    </div>
</template>

<script src="./ts/index.ts"></script>

<style scoped lang="scss">
.avatar_item{
    float: left;
    width: 60px;
    height: 60px;
    margin-right: 10px;
    border-radius: 3px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
}
.upload_avatar_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    line-height: 14px;
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    color: #000;
    font-size: 20px;
    transition: 0.3s;

    &:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
    }
}
</style>
