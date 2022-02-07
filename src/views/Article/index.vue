<template>
    <div class="article-page">
        <div class="search-form">
            <label>文章状态：</label>
            <el-select v-model="articleStatus" placeholder="请选择" @change="getArticle(1)">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-button style="margin-left: 15px;" type="primary" @click="openArticleDrawer(false)">新建</el-button>
        </div>
        <template v-if="articleList.length === 0">
            <NoData/>
        </template>
        <template v-else>
            <div class="article-list">
                <div class="article-item" v-for="article in articleList" :key="article.articleId">
                    <div class="article-item-con">
                        <div class="article-item-left">
                            <p class="article-title">{{ article.articleTitle }}
                                <el-tooltip placement="right"
                                            :content="article.isPublish === 0 ? '未发布' : '已发布'"
                                            effect="customized">
                                    <span :style="{color: article.isPublish === 0 ? '#E6A23C' : '#67C23A', cursor: 'pointer'}"
                                          @click="updateArticlePublish(article.articleId, article.isPublish)"
                                    ><el-icon><Promotion/></el-icon></span>
                                </el-tooltip>
                            </p>
                            <p class="article-keyword">{{ article.articleKeyword }}</p>
                            <p class="article-info">{{ article.articleInfo }}</p>
                            <p class="article-type">
                                <el-tag v-for="item in article.classTypeList" :key="item.classId">{{ item.className }}</el-tag>
                            </p>
                            <p class="article-type">
                                <el-tag type="success" v-for="item in article.tagTypeList" :key="item.tagId">{{ item.tagName }}</el-tag>
                            </p>
                        </div>
                        <div class="article-item-right">
                            <p class="article-time">{{ article.createDate }}</p>
                            <div class="article-cover" @click="goView(article.articleId)">
                                <img :src="article.articleCover" alt="">
                            </div>
                            <div class="item-info-oper">
                                <template v-if="articleStatus === 3">
                                    <el-button type="text" @click="reversalArticle(article.articleId)">恢复删除</el-button>
                                </template>
                                <template v-else-if="articleStatus === 0 || articleStatus === 2">
                                    <el-button type="text" @click="openArticleDrawer(true, article.articleId)">编辑信息</el-button>
                                    <el-button type="text" @click="openUpdateContent(article.articleId)">编辑文章</el-button>
                                    <el-popover
                                        placement="bottom"
                                        trigger="hover"
                                        width="60px"
                                    >
                                        <template #reference>
                                            <el-button type="text">
                                                <svg-icon icon-class="round-menu"/>
                                            </el-button>
                                        </template>
                                        <template #default>
                                            <el-button type="danger" round @click="removeArticle(article.articleId)">删除</el-button>
                                        </template>
                                    </el-popover>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <el-pagination
                style="margin: 30px auto;text-align: center;"
                background
                layout="prev, pager, next"
                :page-size="pagination.pageSize"
                v-model:current-page="pagination.page"
                :total="pagination.total">
            </el-pagination>
        </template>

        <el-drawer v-model="articleDialog.visible"
                   @close="closeArticleDrawer"
                   :size="600">
            <template #title>
                <h4>{{ articleDialog.title }}</h4>
            </template>
            <template #default>
                <el-scrollbar>
                    <el-form :model="articleForm" status-icon :rules="formRules"
                             ref="articleFormRef"
                             v-loading="articleDialog.formLoading"
                             label-width="100px">
                        <el-form-item label="文章标题" prop="articleTitle">
                            <el-input type="text" v-model="articleForm.articleTitle"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="文章关键词">
                            <el-input type="text" v-model="articleForm.articleKeyword"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="文章简介" prop="articleInfo">
                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                                      v-model="articleForm.articleInfo"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="文章封面" prop="articleCover">
                            <template v-if="articleForm.articleCover.length > 0">
                                <div
                                    style="float: left; width: 60px; height: 60px; margin-right: 20px; border-radius: 6px; overflow: hidden;">
                                    <img style="width: 100%; height: 100%; cursor: pointer;"
                                         :src="articleForm.articleCover[0].url" alt="">
                                </div>
                            </template>
                            <el-button type="primary"
                                       @click="articleDialog.uploadImgVisible = true">上传封面
                            </el-button>
                        </el-form-item>
                        <el-form-item label="所属类型" prop="classType">
                            <el-select v-model="articleForm.classType"
                                       style="width: 100%"
                                       multiple
                                       @visible-change="classTypeChange"
                                       @remove-tag="classTypeRemove"
                                       placeholder="请选择">
                                <el-option
                                    v-for="item in classTypeOptions"
                                    :key="item.classId"
                                    :label="item.className"
                                    :value="item.classId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="文章标签" prop="tagType">
                            <el-select v-model="articleForm.tagType"
                                       style="width: 100%"
                                       no-data-text="无数据"
                                       multiple
                                       placeholder="请选择">
                                <el-option
                                    v-for="item in articleDialog.tagTypeOptions"
                                    :key="item.tagId"
                                    :label="item.tagName"
                                    :value="item.tagId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-scrollbar>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="articleDialog.visible = false">取消</el-button>
                    <el-button type="primary" @click="submitArticle" :loading="articleDialog.btnLoading">
                        {{ articleDialog.btnLoading ? '保存中...' : '保存' }}
                    </el-button>
                </div>
            </template>
        </el-drawer>

        <UploadImage v-model:imgList="articleForm.articleCover"
                     v-model:uploadImgVisible="articleDialog.uploadImgVisible"
                     :imgWidth="100"
                     :imgHeight="100"
                     thumbnail="articleCover"
                     @image-upload-success="imageUploadSuccess"
                     :limitNum="1"></UploadImage>

        <el-dialog
            v-model="editContentModel.mdEditorVisible"
            title="标题"
            fullscreen
            center
            :show-close="false"
            @close="closeUpdateContent"
            custom-class="markdown-content">
            <template #default>
                <MdEditor v-model:content="editContentModel.articleContent" @on-save="saveArtilceContent" />
            </template>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editContentModel.mdEditorVisible = false">返回</el-button>
                    <el-button type="primary" @click="saveArtilceContent">保存</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script src="./ts/index.ts"></script>

<style lang="scss">
.article-list {
    padding: 20px 0;

    .article-item {
        padding: 10px 0;
        border-bottom: 1px dotted #ddd;

        p {
            margin-bottom: 5px;
        }
    }

    .article-item-con {
        display: flex;
        background-color: #f9f9f9;
        border-radius: 5px;
        padding: 5px;
    }

    .article-item-left {
        flex: 1;
        padding-right: 30px;

        .article-title {
            font-size: 22px;
            font-weight: 500;
            color: #222;
            word-wrap: break-word;
            word-break: break-word;
        }

        .article-info {
            max-height: 40px;
            line-height: 20px;
            font-size: 14px;
            font-family: monospace;
            text-overflow: ellipsis;
            white-space: normal;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 2;
            color: #5a5e66;
        }

        .article-keyword {
            font-size: 14px;
            font-family: fangsong;
            font-weight: 500;
            line-height: 20px;
        }
    }

    .article-item-right {
        text-align: right;

        .article-time {
            height: 24px;
            line-height: 24px;
            color: #999;
            font-size: 14px;
        }

        .article-cover {
            display: inline-block;
            width: 125px;
            height: 100px;

            img {
                width: 100%;
                height: 100%;
                object-fit: fill;
                object-position: center;
            }
        }
    }

    .el-tag {
        margin-right: 5px;
    }
}

.el-popover.el-popper {
    min-width: auto;
}

.el-popper {
    &.is-customized,
    .el-popper__arrow::before {
        background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
    }
}

.markdown-content {
    .el-dialog__body {
        height: calc(100vh - 175px);
    }

    #md-editor-v3 {
        height: 100%;
    }
}
</style>
