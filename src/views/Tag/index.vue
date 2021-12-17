<template>
    <div class="tag-page"></div>
</template>

<script lang="ts">
import { Vue, Options, Ref } from "vue-property-decorator";
import { TagApi } from "@/api";
import { TagInfo } from "@/api/tag/types";
import ElForm from "element-plus";
// import { CirclePlus, Delete, Edit } from "@element-plus/icons";

interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

interface DialogModel {
    dialogVisible: boolean;
    isNew: boolean;
    title: string;
    loading: boolean;
    saveFlag: boolean;
}

@Options({})
export default class TagAdmin extends Vue {
    @Ref() readonly tagFormRef!: typeof ElForm;

    public tagTableList: [] = [];
    public tagTableLoading: boolean = false;

    public pagination: Pagination = {
        page: 1,
        pageSize: 10,
        total: 0,
    };

    public tagDialog: DialogModel = {
        dialogVisible: false,
        isNew: true,
        title: "",
        loading: false,
        saveFlag: false,
    };

    public classTypeOptions: Array<any> = [];

    tagForm: TagInfo = {
        tagId: 0,
        tagName: "",
        classType: 0,
        tagDesc: "",
    };

    public tagFormRules = {
        tagName: [
            { required: true, message: "请输入标签名称", trigger: "blur" },
        ],
        classType: [
            { required: true, message: "请选择所属分类", trigger: "change" },
        ],
    };

    public getTagList (page: number): void {
        this.tagTableLoading = true

        TagApi.getTagList({page: page, pageSize: this.pagination.pageSize}).then(res => {
            let data = res.data
            this.pagination.page = data.pagination.page
            this.pagination.total = data.pagination.total
            this.tagTableList = data.tagList
        }).catch(() => {
            this.$msg.error('获取失败')
        }).finally(() => {
            this.tagTableLoading = false
        })
    }

    public currentChange (page: number): void {
        this.getTagList(page)
    }

    public openTagDialog (isNew: boolean, tagId: string): void {
        this.tagDialog.isNew = isNew
        if (isNew) {
            this.tagDialog.title = '新增标签'
        } else {
            this.tagDialog.title = '修改标签'
            this.tagDialog.loading = true
            TagApi.getTagInfo(tagId).then(res => {
                this.tagForm = Object.assign({}, res.data);
            }).catch(() => {
                this.$msg.error('获取信息失败')
            }).finally(() => {
                this.tagDialog.loading = false
            })
        }
        this.tagDialog.dialogVisible = true
    }
}
</script>

<style scoped></style>
