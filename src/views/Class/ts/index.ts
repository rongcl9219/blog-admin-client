import { Vue, Options, Ref } from "vue-property-decorator";
import { ClassApi } from "@/api";
import { ClassInfo } from "@/api/class/types";
import { ElForm } from "element-plus";
import { CirclePlus, Delete, Edit } from "@element-plus/icons";
import { Pagination, DialogModel, FormRule, classTypeItem } from "./types";

@Options({
    components: {
        CirclePlus,
        Delete,
        Edit,
    },
})
export default class ClassAdmin extends Vue {
    @Ref() readonly classFormRef!: typeof ElForm;

    public classTableList: Array<any> = [];

    public classTableLoading: boolean = false;

    public pagination: Pagination = {
        page: 1,
        pageSize: 10,
        total: 0,
    };

    public classDialog: DialogModel = {
        dialogVisible: false,
        isNew: true,
        title: "",
        loading: false,
        saveFlag: false,
    };

    private classTypeOptions: Array<classTypeItem> = [
        { value: 0, label: "默认分类" },
        { value: 1, label: "编程语言" },
        { value: 2, label: "开发工具" },
        { value: 3, label: "其他技能" },
    ];

    public classForm: ClassInfo = {
        classId: "",
        classCode: "",
        className: "",
        classType: 0,
        classDesc: "",
    };

    public formRules: FormRule = {
        className: [
            { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        classCode: [
            { validator: this.checkClassCode, required: true, trigger: "blur" },
        ],
    };

    public checkClassCode(rule: any, value: string, callback: any) {
        if (!value.trim()) {
            callback(new Error("请输入分类编号"));
        } else {
            // 正则以大写字母开始，可以包含大写字母和_组成的2-20个字符
            if (!/^[A-Z]([_A-Z]{1,19})$/.test(value)) {
                callback(
                    new Error(
                        "分类编号必须是以大写字母开始，可以包含大写字母和_组成的2-20个字符"
                    )
                );
            } else {
                callback();
            }
        }
    }

    public getClassData(page: number): void {
        this.classTableLoading = true;

        ClassApi.getClassList({
            page: page,
            pageSize: this.pagination.pageSize,
        })
            .then((res) => {
                const data = res.data;
                this.pagination.page = data.pagination.page;
                this.pagination.total = data.pagination.total;
                this.classTableList = data.classList;
            })
            .catch(() => {
                this.$msg.error("获取失败");
            })
            .finally(() => {
                this.classTableLoading = false;
            });
    }

    public currentChange(page: number): void {
        this.getClassData(page);
    }

    public openClassDialog(isNew: boolean, classId?: string): void {
        this.classDialog.isNew = isNew;
        if (isNew) {
            this.classDialog.title = "新增分类";
        } else {
            this.classDialog.title = "修改分类";
            this.classDialog.loading = true;
            if (classId) {
                ClassApi.getClassInfo(classId)
                    .then((res) => {
                        this.classForm = Object.assign({}, res.data);
                    })
                    .catch(() => {
                        this.$msg.error("获取失败");
                    })
                    .finally(() => {
                        this.classDialog.loading = false;
                    });
            }
        }

        this.classDialog.dialogVisible = true;
    }

    public closeClassDiaLog(): void {
        this.classForm.classId = "";
        this.classForm.classType = 0;
        this.classForm.classDesc = "";
        this.classFormRef.resetFields();
    }

    public saveClass() {
        this.classDialog.saveFlag = true;
        this.classDialog.loading = true;
        this.classFormRef
            .validate()
            .then(() => {
                const data: ClassInfo = {
                    classCode: this.classForm.classCode,
                    className: this.classForm.className,
                    classType: this.classForm.classType,
                    classDesc: this.classForm.classDesc,
                };
                if (this.classDialog.isNew) {
                    ClassApi.newClass(data)
                        .then(() => {
                            this.$msg.success("新增成功");
                            this.classDialog.dialogVisible = false;
                            this.getClassData(1);
                        })
                        .catch(() => {
                            this.$msg.error("新增失败");
                        })
                        .finally(() => {
                            this.classDialog.saveFlag = false;
                            this.classDialog.loading = false;
                        });
                } else {
                    data.classId = this.classForm.classId;
                    ClassApi.updateClass(data)
                        .then(() => {
                            this.$msg.success("修改成功");
                            this.classDialog.dialogVisible = false;
                            this.getClassData(1);
                        })
                        .catch(() => {
                            this.$msg.error("修改失败");
                        })
                        .finally(() => {
                            this.classDialog.saveFlag = false;
                            this.classDialog.loading = false;
                        });
                }
            })
            .catch(() => {
                this.classDialog.saveFlag = false;
                this.classDialog.loading = false;
            });
    }

    public removeClass(classId: string): void {
        this.$confirm("是否删除该分类？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                ClassApi.deleteClass(classId)
                    .then(() => {
                        this.$msg.success("删除成功");
                        this.getClassData(1);
                    })
                    .catch(() => {
                        this.$msg.error("删除失败");
                    });
            })
            .catch(() => {
                return false;
            });
    }

    public classTypeFilter(value: number): string {
        let classTypeStr = "";
        if (value === 0) {
            classTypeStr = "默认分类";
        } else if (value === 1) {
            classTypeStr = "编程语言";
        } else if (value === 2) {
            classTypeStr = "开发工具";
        } else if (value === 3) {
            classTypeStr = "其他技能";
        }
        return classTypeStr;
    }

    created() {
        this.getClassData(1);
    }
}
