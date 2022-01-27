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
                        @click="openTagDialog(true)"
                    >
                        <el-icon><CirclePlus /></el-icon>
                        新增标签
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

<script src="./ts/index.ts"></script>

<style scoped></style>
