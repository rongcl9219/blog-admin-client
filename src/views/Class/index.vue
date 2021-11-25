<template>
    <div class="class-page">
        <el-table
            v-loading="classTableLoading"
            :data="classTableList"
            row-key="classId"
            stripe
            style="width: 100%"
        >
            <el-table-column prop="index" align="center" width="50" />
            <el-table-column
                prop="className"
                label="分类名称"
                align="center"
                min-width="100px"
            />
            <el-table-column
                prop="classCode"
                label="分类编号"
                align="center"
                min-width="100px"
            />
            <el-table-column
                prop="classType"
                label="分类类型"
                align="center"
                min-width="100px"
            >
                <template #default="scope">
                    {{ classTypeFilter(scope.row.classType) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="classDesc"
                label="分类描述"
                align="center"
                min-width="100px"
            />
            <el-table-column
                prop="createDate"
                label="创建时间"
                align="center"
                min-width="100px"
            />
            <el-table-column
                fixed="right"
                label="操作"
                align="right"
                width="150"
            >
                <template #header>
                    <el-button
                        type="primary"
                        size="small"
                        @click="openClassDialog(true)"
                    >
                        <el-icon><CirclePlus /></el-icon>
                        新增分类
                    </el-button>
                </template>
                <template #default="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="openClassDialog(false, scope.row.classId)"
                    >
                        <el-icon><Edit /></el-icon>修改
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        style="color: #ff0000"
                        @click="removeClass(scope.row.classId)"
                        ><el-icon><Delete /></el-icon>删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin: 30px auto; text-align: center"
            background
            layout="prev, pager, next"
            :page-size="pagination.pageSize"
            v-model:current-page="pagination.page"
            :total="pagination.total"
            @current-change="currentChange"
        >
        </el-pagination>

        <!--   新增分类弹窗   -->
        <el-dialog
            :title="classDialog.title"
            v-model="classDialog.dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="closeClassDiaLog()"
            width="50%"
        >
            <el-form
                :model="classForm"
                status-icon
                :rules="formRules"
                v-loading="classDialog.loading"
                ref="classFormRef"
                label-width="100px"
            >
                <el-form-item label="分类名称" prop="className">
                    <el-input
                        type="text"
                        v-model="classForm.className"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="分类编号" prop="classCode">
                    <el-input
                        type="text"
                        v-model="classForm.classCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="分类类型">
                    <el-select
                        v-model="classForm.classType"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in classTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类描述">
                    <el-input
                        type="text"
                        v-model="classForm.classDesc"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="classDialog.dialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button
                        type="primary"
                        @click="saveClass()"
                        :loading="classDialog.saveFlag"
                        >{{
                            classDialog.saveFlag ? "保存中..." : "保 存"
                        }}</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Options, Ref } from "vue-property-decorator";
import { ClassApi } from "@/api";
import { ClassInfo } from "@/api/class/types";
import { ElForm } from "element-plus";
import { CirclePlus, Delete, Edit } from "@element-plus/icons";

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

    public classTypeOptions: Array<any> = [
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

    public formRules = {
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
                let data = res.data;
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
                let data: ClassInfo = {
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
</script>
