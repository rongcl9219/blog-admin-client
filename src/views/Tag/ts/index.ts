import { Vue, Options, Ref } from "vue-property-decorator";
import { TagApi, ClassApi } from "@/api";
import { ClassInfo } from "@/api/class/types";
import { TagInfo } from "@/api/tag/types";
import { ElForm } from "element-plus";
import { CirclePlus, Delete, Edit } from "@element-plus/icons-vue";
import { Pagination, DialogModel, FormRule } from "./types";

@Options({
    components: {
        CirclePlus,
        Delete,
        Edit,
    },
})
export default class TagAdmin extends Vue {
    @Ref() readonly tagFormRef!: typeof ElForm;

    public tagTableList: Array<any> = [];

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

    public formRules: FormRule = {
        tagName: [
            {
                required: true,
                message: "请输入标签名称",
                trigger: ["blur", "change"],
            },
        ],
        classType: [
            {
                required: true,
                message: "请选择所属分类",
                trigger: ["blur", "change"],
            },
        ],
    };

    public classTypeOptions: Array<ClassInfo> = [];

    public tagForm: TagInfo = {
        tagId: 0,
        tagName: "",
        tagDesc: "",
        classType: "",
    };

    getTagList(page: number) {
        this.tagTableLoading = true;

        TagApi.getTagList({ page: page, pageSize: this.pagination.pageSize })
            .then((res) => {
                const data = res.data;
                this.pagination.page = data.pagination.page;
                this.pagination.total = data.pagination.total;
                this.tagTableList = data.tagList;
            })
            .catch(() => {
                this.$msg.error("获取失败");
            })
            .finally(() => {
                this.tagTableLoading = false;
            });
    }

    currentChange(page: number) {
        this.getTagList(page);
    }

    openTagDialog(isNew: boolean, tagId?: string) {
        this.tagDialog.isNew = isNew;
        if (isNew) {
            this.tagDialog.title = "新增标签";
        } else {
            this.tagDialog.title = "修改标签";
            if (tagId) {
                this.tagDialog.loading = true;
                TagApi.getTagInfo(tagId)
                    .then((res) => {
                        this.tagForm = Object.assign({}, res.data);
                    })
                    .catch(() => {
                        this.$msg.error("获取信息失败");
                    })
                    .finally(() => {
                        this.tagDialog.loading = false;
                    });
            }
        }
        this.tagDialog.dialogVisible = true;
    }

    closeTagDiaLog() {
        this.tagForm.tagId = 0;
        this.tagForm.classType = "";
        this.tagForm.tagDesc = "";
        this.tagFormRef.resetFields();
    }

    saveTag() {
        this.tagDialog.saveFlag = true;
        this.tagDialog.loading = true;
        this.tagFormRef
            .validate()
            .then(() => {
                let data = Object.assign(
                    {},
                    {
                        tagName: this.tagForm.tagName,
                        classType: this.tagForm.classType,
                        tagDesc: this.tagForm.tagDesc,
                    }
                );
                if (this.tagDialog.isNew) {
                    TagApi.newTag(data)
                        .then(() => {
                            this.$msg.success("新增成功");
                            this.tagDialog.dialogVisible = false;
                            this.getTagList(1);
                        })
                        .catch(() => {
                            this.$msg.error("新增失败");
                        })
                        .finally(() => {
                            this.tagDialog.saveFlag = false;
                            this.tagDialog.loading = false;
                        });
                } else {
                    data = Object.assign({}, data, {
                        tagId: this.tagForm.tagId,
                    });
                    TagApi.updateTag(data)
                        .then(() => {
                            this.$msg.success("修改成功");
                            this.tagDialog.dialogVisible = false;
                            this.getTagList(1);
                        })
                        .catch(() => {
                            this.$msg.error("修改失败");
                        })
                        .finally(() => {
                            this.tagDialog.saveFlag = false;
                            this.tagDialog.loading = false;
                        });
                }
            })
            .catch(() => {
                this.tagDialog.saveFlag = false;
                this.tagDialog.loading = false;
            });
    }

    deleteTag(tagId: string) {
        this.$confirm("是否删除该标签？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                TagApi.deleteTag(tagId)
                    .then(() => {
                        this.$msg.success("删除成功");
                        this.getTagList(1);
                    })
                    .catch(() => {
                        this.$msg.error("删除失败");
                    });
            })
            .catch(() => {
                return false;
            });
    }

    created() {
        ClassApi.getAllClass()
            .then((res) => {
                this.classTypeOptions = res.data;
            })
            .catch(() => {
                return false;
            });

        this.getTagList(1);
    }
}
