<template>
    <svg :class="svgClass" aria-hidden="true" v-bind="$attrs">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";

@Options({
    name: "svg-icon"
})
export default class SvgIcon extends Vue {
    @Prop({ type: String, default: "", required: true }) iconClass: string;
    @Prop({ type: String, default: "" }) className: string;

    get iconName() {
        return `#icon-${this.iconClass}`;
    }

    get svgClass() {
        if (this.className) {
            return "svg-icon " + this.className;
        } else {
            return "svg-icon";
        }
    }
}
</script>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
}
</style>
