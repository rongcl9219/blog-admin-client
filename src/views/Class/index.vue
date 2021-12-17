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
            @close="closeClassDiaLog"
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
                        @click="saveClass"
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

<script src="./ts/index.ts"></script>
