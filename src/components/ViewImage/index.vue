<template>
    <div class="view-image">
        <slot :images="images" :options="options"></slot>
    </div>
</template>

<script lang="ts">
import { Vue, Options, Prop, Watch } from "vue-property-decorator";
import Viewer from "viewerjs";
import { viewerDefaultOptions } from "@/components/ViewImage/config.ts";
import "viewerjs/dist/viewer.css";

@Options({
    name: "ViewImage"
})
export default class ViewImage extends Vue {
    @Prop({ type: Array, default: [] }) images: Array<string>;
    @Prop({ type: Boolean, default: false }) rebuild: boolean;
    @Prop({ type: Object, default: {} }) options: any;

    private viewerObj: any;

    @Watch("images", { deep: true })
    onImagesChanged() {
        this.$nextTick(() => {
            this.onChange();
        });
    }

    @Watch("options", { deep: true })
    onOptionsChanged() {
        this.$nextTick(() => {
            this.onChange();
        });
    }

    get viewerOptions() {
        return Object.assign({}, viewerDefaultOptions, this.options);
    }

    onChange() {
        if (this.rebuild) {
            this.rebuildViewer();
        } else {
            this.updateViewer();
        }
    }

    rebuildViewer() {
        this.destroyViewer();
        this.createViewer();
    }

    updateViewer() {
        if (this.viewerObj) {
            this.viewerObj.update();
        } else {
            this.createViewer();
        }
    }

    destroyViewer() {
        this.viewerObj && this.viewerObj.destroy();
    }

    createViewer() {
        this.viewerObj = new Viewer(this.$el, this.viewerOptions);
    }

    show(index: number) {
        this.viewerObj.view(index || 0);
    }

    mounted() {
        this.createViewer();
    }

    unmounted() {
        this.destroyViewer();
    }
}
</script>

<style scoped lang="scss">
.view-image {
    display: inline;
    vertical-align: top;
}
</style>
