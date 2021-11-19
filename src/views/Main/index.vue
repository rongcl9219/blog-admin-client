<template>
    <div>
        <el-row>
            <el-button>Default</el-button>
            <el-button type="primary">Primary</el-button>
            <el-button type="success">Success</el-button>
            <el-button type="info">Info</el-button>
            <el-button type="warning">Warning</el-button>
            <el-button type="danger">Danger</el-button>
            <el-button>中文</el-button>
        </el-row>
        <div>
            <el-link href="https://element.eleme.io" target="_blank"
            >default</el-link
            >
            <el-link type="primary">primary</el-link>
            <el-link type="success">success</el-link>
            <el-link type="warning">warning</el-link>
            <el-link type="danger">danger</el-link>
            <el-link type="info">info</el-link>
        </div>
        <div>
            <el-checkbox v-model="checked1" label="Option 1"></el-checkbox>
            <el-checkbox v-model="checked2" label="Option 2"></el-checkbox>
        </div>
        <div>
            <el-pagination background layout="prev, pager, next" :total="1000" />
        </div>
        <div><el-input v-model="input"></el-input></div>
        <div>
            <el-form
                ref="form"
                :model="ruleForm"
                label-width="120px"
                class="demo-ruleForm">
                <el-form-item label="Activity name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";

@Options({})
export default class Main extends Vue {
    checked1 = 1;
    checked2 = 2;

    input = "";

    ruleForm = {
        name: ""
    }

    rules = {
        name: [
            {
                required: true,
                message: 'Please input Activity name',
                trigger: 'blur',
            },
            {
                min: 3,
                max: 5,
                message: 'Length should be 3 to 5',
                trigger: 'blur',
            },
        ],
    }
}
</script>

<style scoped></style>
