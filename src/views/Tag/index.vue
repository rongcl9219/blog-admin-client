<template>
    <div class="tag-page">
        <el-table
            v-loading="tagTableLoading"
            :data="tagTableList"
            row-key="tagId"
            stripe
            style="width: 100%"
        >
            <el-table-column prop="index" align="center" width="50" />
            <el-table-column
                prop="tagName"
                label="标签名称"
                align="center"
                min-width="100px"
            />
            <el-table-column
                prop="className"
                label="所属分类"
                align="center"
                min-width="100px"
            />
            <el-table-column
                prop="classType"
                label="标签描述"
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
                        @click="openTagDialog(true)"
                    >
                        <el-icon><CirclePlus /></el-icon>
                        新增分类
                    </el-button>
                </template>
                <template #default="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="openTagDialog(false, scope.row.tagId)"
                    >
                        <el-icon><Edit /></el-icon>修改
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        style="color: #ff0000"
                        @click="deleteTag(scope.row.tagId)"
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

        <el-dialog
            :title="tagDialog.title"
            v-model="tagDialog.dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="closeTagDiaLog"
            width="50%"
        >
            <el-form
                :model="tagForm"
                status-icon
                :rules="formRules"
                v-loading="tagDialog.loading"
                ref="tagFormRef"
                label-width="100px"
            >
                <el-form-item label="标签名称" prop="tagName">
                    <el-input
                        type="text"
                        v-model="tagForm.tagName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="所属分类" prop="classType">
                    <el-select v-model="tagForm.classType" placeholder="请选择">
                        <el-option
                            v-for="item in classTypeOptions"
                            :key="item.classId"
                            :label="item.className"
                            :value="item.classId"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签描述">
                    <el-input
                        type="text"
                        v-model="tagForm.tagDesc"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="tagDialog.dialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button
                        type="primary"
                        @click="saveTag"
                        :loading="tagDialog.saveFlag"
                        >{{
                            tagDialog.saveFlag ? "保存中..." : "保 存"
                        }}</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Options, Ref } from "vue-property-decorator";
<<<<<<< HEAD
import { TagApi } from "@/api";
import { TagInfo } from "@/api/tag/types";
import ElForm from "element-plus";
// import { CirclePlus, Delete, Edit } from "@element-plus/icons";

interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

=======
import { TagApi, ClassApi } from "@/api";
import { TagInfo } from "@/api/tag/types";
import { ElForm } from "element-plus";
import { CirclePlus, Delete, Edit } from "@element-plus/icons";

interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

>>>>>>> 2a5f86c77791edf1c8042e037c30ea0382b85534
interface DialogModel {
    dialogVisible: boolean;
    isNew: boolean;
    title: string;
    loading: boolean;
    saveFlag: boolean;
}

<<<<<<< HEAD
@Options({})
export default class TagAdmin extends Vue {
    @Ref() readonly tagFormRef!: typeof ElForm;

    public tagTableList: [] = [];
=======
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

>>>>>>> 2a5f86c77791edf1c8042e037c30ea0382b85534
    public tagTableLoading: boolean = false;

    public pagination: Pagination = {
        page: 1,
        pageSize: 10,
        total: 0,
    };

    public tagDialog: DialogModel = {
        dialogVisible: false,
<<<<<<< HEAD
        isNew: true,
=======
        isNew: false,
>>>>>>> 2a5f86c77791edf1c8042e037c30ea0382b85534
        title: "",
        loading: false,
        saveFlag: false,
    };

<<<<<<< HEAD
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
=======
    public formRules = {
        tagName: [
            { required: true, message: "请输入标签名称", trigger: ["blur", "change"] },
        ],
        classType: [
            { required: true, message: "请选择所属分类", trigger: ["blur", "change"] },
        ],
    };

    public classTypeOptions: Array<any> = [];

    public tagForm: TagInfo = {
        tagId: "",
        tagName: "",
        tagDesc: "",
        classType: "",
    };

    getTagList(page: number) {
        this.tagTableLoading = true;

        TagApi.getTagList({ page: page, pageSize: this.pagination.pageSize })
            .then((res) => {
                let data = res.data;
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
        this.tagForm.tagId = "";
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
>>>>>>> 2a5f86c77791edf1c8042e037c30ea0382b85534
    }
}
</script>

<style scoped></style>
