<template>
    <div class="tag-page"></div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
// import {TagApi, ClassApi} from "@/api";
// import { TagInfo } from "@/api/tag/types";
// import { ElFormItemContext } from "element-plus";
// import { CirclePlus, Delete, Edit } from "@element-plus/icons";

@Options({})
export default class TagAdmin extends Vue {
    public tagTableList: []
}
</script>

<style scoped></style>
