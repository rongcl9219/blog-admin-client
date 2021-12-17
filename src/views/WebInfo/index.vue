<template>
    <div id="webInfo">
        <el-card class="box-card">
            <el-form ref="webInfoFormRef" :model="form" label-width="100px">
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
                        <div class="avatar_item">
                            <img :src="form.avatar.url" alt="" />
                        </div>
                    </template>
                    <el-button class="upload_avatar_btn" type="primary" icon="el-icon-plus" @click="uploadAvatarVisible = true"></el-button>
                </el-form-item>
                <el-form-item label="网站banner">
                    <template v-if="webBannerUrl">
                        <div class="avatar_item">
                            <img :src="webBannerUrl" alt="" />
                        </div>
                    </template>
                    <el-button class="upload_avatar_btn" type="primary" icon="el-icon-plus" @click="upLoadImgVisible = true"></el-button>
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
    </div>
</template>

<script src="./ts/index.ts"></script>

<style scoped></style>
