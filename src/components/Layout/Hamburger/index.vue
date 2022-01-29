<template>
    <div style="padding: 0 15px;" @click="toggleClick" class="hamburger">
        <svg-icon icon-class="menu-open" :class="{ 'is-active': isActive }" />
    </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";

@Options({
    name: "Hamburger"
})
export default class Hamburger extends Vue {
    @Prop({type: Boolean, default: false}) isActive: boolean;

    toggleClick() {
        this.$emit("toggleClick");
    }
}
</script>

<style scoped lang="scss">
.hamburger {
    color: var(--el-color-primary);

    .svg-icon {
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 20px;
    }
    .is-active {
        transform: rotate(180deg);
    }

}
</style>
