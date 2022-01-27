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
            <el-button style="margin-left: 15px;" type="primary">新建</el-button>
        </div>
        <template v-if="articleList.length === 0">
            <NoData />
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
                                    ><el-icon><Promotion /></el-icon></span>
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
                            <div class="article-cover">
                                <img :src="article.articleCover" alt="">
                            </div>
                            <div class="item-info-oper">
                                <template v-if="articleStatus === 3">
                                    <el-button type="text" @click="reversalArticle(article.articleId)">恢复删除</el-button>
                                </template>
                                <template v-else-if="articleStatus === 0 || articleStatus === 2">
                                    <el-button type="text">编辑信息</el-button>
                                    <el-button type="text">编辑文章</el-button>
                                    <el-popover
                                        placement="bottom"
                                        trigger="hover"
                                        width="60px"
                                    >
                                        <template #reference>
                                            <el-button type="text">
                                                <svg-icon icon-class="round-menu" />
                                            </el-button>
                                        </template>
                                        <template #default>
                                            <el-button type="danger" round size="mini" @click="removeArticle(article.articleId)">删除</el-button>
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
</style>
