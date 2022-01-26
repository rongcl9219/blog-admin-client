import { Vue, Options } from "vue-property-decorator";
import * as types from "./types";
import { ArticleInfo } from "@/api/article/types.ts";
import { TagInfo } from "@/api/tag/types";
import { ClassInfo } from "@/api/class/types";
import { TagApi, ClassApi, ArticleApi } from "@/api";

@Options({})
export default class ArticleAdmin extends Vue {
    public pageLoading: boolean = false;
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
    public articleList: Array<ArticleInfo> = [];
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
        articleCover: "",
        classType: "",
        tagType: ""
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

    getArticle(page: number) {
        if (this.pageLoading) {
            return;
        }
        this.pageLoading = true;
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
            this.pageLoading = false;
        });
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
    }
}
