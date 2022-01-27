import { Vue, Options, Ref } from "vue-property-decorator";
import * as types from "./types";
import { ArticleInfo } from "@/api/article/types.ts";
import { TagInfo } from "@/api/tag/types";
import { ClassInfo } from "@/api/class/types";
import { TagApi, ClassApi, ArticleApi } from "@/api";
import NoData from "@/components/NoData/index.vue";
import { Promotion } from "@element-plus/icons-vue";
import { ElForm } from "element-plus";
import UploadImage from "@/components/UploadImage/index.vue";

interface Article extends ArticleInfo {
    isPublish: number;
    createUsername: string;
    createDate: string;
    isDelete: number;
    classTypeList: Array<ClassInfo>;
    tagTypeList: Array<TagInfo>;
    articleCoverInfo: any;
}

@Options({
    components: {
        NoData,
        Promotion,
        UploadImage
    }
})
export default class ArticleAdmin extends Vue {
    private pageLoading: any;
    public articleStatus: number = 0;
    public options: Array<types.Optinon> = [
        {
            value: 0,
            label: "全部"
        }, {
            value: 1,
            label: "已发布"
        }, {
            value: 2,
            label: "未发布"
        }, {
            value: 3,
            label: "已删除"
        }
    ];
    public articleList: Array<Article> = [];
    public allTagList: Array<TagInfo> = [];
    public classTypeOptions: Array<ClassInfo> = [];
    public pagination: types.Pagination = {
        page: 1,
        pageSize: 10,
        total: 0
    };
    public articleDialog: types.DialogModel = {
        title: "",
        isEdit: false,
        visible: false,
        btnLoading: false,
        formLoading: false,
        uploadImgVisible: false,
        tagTypeOptions: []
    };
    public articleForm: ArticleInfo = {
        articleId: "",
        articleTitle: "",
        articleSubtitle: "",
        articleKeyword: "",
        articleInfo: "",
        articleCover: [],
        classType: [],
        tagType: []
    };
    public formRules: types.FormRule = {
        articleTitle: [
            { required: true, message: "请输入文章标题", trigger: "blur" }
        ],
        articleInfo: [
            { required: true, message: "请输入文章简介", trigger: "blur" }
        ],
        articleCover: [
            { required: true, message: "请选择文章封面", trigger: "blur" }
        ],
        classType: [
            { required: true, message: "请选择所属分类", trigger: "change" }
        ],
        tagType: [
            { required: true, message: "请选择所属标签", trigger: "change" }
        ]
    };
    public editContentModel: types.EditModel = {
        articleId: "",
        articleContent: "",
        mavonEditorVisible: false
    };

    @Ref("articleFormRef") readonly articleFormRef!: typeof ElForm;

    getArticle(page: number) {
        this.pageLoading = this.$loading();
        ArticleApi.getArticleList({
            page: page,
            pageSize: this.pagination.pageSize,
            articleStatus: this.articleStatus
        }).then(res => {
            const data = res.data;
            this.pagination.page = data.pagination.page;
            this.pagination.total = data.pagination.total;
            this.articleList = data.articleList;
        }).catch(() => {
            this.$msg.error("获取失败");
        }).finally(() => {
            this.pageLoading.close();
        });
    }

    updateArticlePublish(articleId: string, isPublish: number) {
        const tip = isPublish === 0 ? "发布" : "取消发布";
        ArticleApi.updatePublish(articleId, isPublish).then(() => {
            this.$msg.success(`${tip}成功`);
            this.getArticle(1);
        }).catch(() => {
            this.$msg.error(`${tip}失败`);
        });
    }

    removeArticle(articleId: string) {
        this.$confirm("确定删除该文章？", "提示", {
            type: "warning",
            cancelButtonText: "取消",
            confirmButtonText: "删除"
        }).then(() => {
            ArticleApi.deleteArticle(articleId).then(() => {
                this.$msg.success("删除成功");
                this.getArticle(1);
            }).catch(() => {
                this.$msg.error("删除失败");
            });
        }).catch(() => {
            this.$msg.warning("取消删除");
        });
    }

    reversalArticle(articleId: string) {
        ArticleApi.recoverArticle(articleId).then(() => {
            this.$msg.success("恢复成功");
            this.getArticle(1);
        }).catch(() => {
            this.$msg.error("删除失败");
        });
    }

    classTypeChange() {
        this.articleDialog.tagTypeOptions = [];
        const tagTypeOptionId: Array<any> = [];
        this.allTagList.forEach(tag => {
            if ((this.articleForm.classType as Array<number>).indexOf(Number(tag.classType)) > -1) {
                this.articleDialog.tagTypeOptions.push(tag);
                tagTypeOptionId.push(tag.tagId);
            }
        });
        if (this.articleForm.tagType.length > 0) {
            this.articleForm.tagType = (this.articleForm.tagType as Array<number>).filter(tag => {
                return tagTypeOptionId.indexOf(tag) > -1;
            });
        }
    }

    classTypeRemove(val: number) {
        const tagArr = this.allTagList.reduce((arr: Array<any>, cur: TagInfo) => {
            if (Number(cur.classType) === val) {
                arr.push(cur.tagId);
            }
            return arr;
        }, []);

        this.articleForm.tagType = (this.articleForm.tagType as Array<number>).filter(tag => {
            return tagArr.indexOf(tag) === -1;
        });
    }

    openArticleDrawer(isEdit: boolean, articleId?: string) {
        this.articleDialog.isEdit = isEdit;
        this.articleDialog.title = isEdit ? "编辑文章" : "新增文章";
        this.articleDialog.visible = true;
        if (isEdit && articleId) {
            this.articleDialog.formLoading = true;
            ArticleApi.getArticleInfo(articleId).then((res) => {
                const data: Article = res.data;
                this.articleForm = Object.assign({}, {
                    articleId:  data.articleId,
                    articleTitle: data.articleTitle,
                    articleKeyword: data.articleKeyword,
                    articleInfo: data.articleInfo,
                    articleCover: [data.articleCoverInfo],
                    classType: data.classType.toString().split(',').map(Number),
                    tagType: data.tagType.toString().split(',').map(Number)
                });
                this.classTypeChange();
            }).catch(() => {
                this.$msg.error("获取文章信息失败");
            }).finally(() => {
                this.articleDialog.formLoading = false;
            });
        }
    }

    closeArticleDrawer() {
        this.articleForm.articleId = "";
        this.articleForm.articleKeyword = "";
        this.articleForm.articleCover = [];
        this.articleDialog.tagTypeOptions = [];
        this.articleDialog.isEdit = false;
        this.articleFormRef.resetFields();
    }

    submitArticle() {
        if (this.articleDialog.btnLoading) {
            return false;
        }
        this.articleDialog.btnLoading = true;

        this.articleFormRef
            .validate()
            .then(() => {
                const articleData: ArticleInfo = {
                    articleTitle: this.articleForm.articleTitle,
                    articleKeyword: this.articleForm.articleKeyword,
                    articleInfo: this.articleForm.articleInfo,
                    articleCover: this.articleForm.articleCover[0].key,
                    classType: (this.articleForm.classType as Array<number>).join(','),
                    tagType: (this.articleForm.tagType as Array<number>).join(',')
                }
                this.saveArticle(articleData).then(() => {
                    this.$msg.success(`${this.articleDialog.title}成功`);
                    const page = this.articleDialog.isEdit ? this.pagination.page : 1;
                    this.getArticle(page);
                    this.articleDialog.visible = false;
                }).catch(() => {
                    this.$msg.error(`${this.articleDialog.title}失败`);
                }).finally(() => {
                    this.articleDialog.btnLoading = false;
                });
            })
            .catch(() => {
                this.articleDialog.btnLoading = false;
            });
    }

    saveArticle(articleData: ArticleInfo) {
        if (this.articleDialog.isEdit && this.articleForm.articleId) {
            articleData.articleId = this.articleForm.articleId;
            return ArticleApi.editArticle(articleData);
        } else {
            return ArticleApi.newArticle(articleData);
        }
    }

    imageUploadSuccess() {
        this.articleFormRef.clearValidate("articleCover");
    }

    mounted() {
        // 获取所有分类
        ClassApi.getAllClass().then(res => {
            this.classTypeOptions = res.data;
        }).catch();
        // 获取所有标签
        TagApi.getAllTag().then(res => {
            this.allTagList = res.data;
        }).catch();
        this.getArticle(1);
    }
}
