<template>
    <div class="article-page">
        <div class="search-form">
            <label>文章状态：</label>
            <el-select v-model="articleStatus" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script src="./ts/index.ts"></script>

<style scoped></style>
