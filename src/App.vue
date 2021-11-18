<template>
  <router-view />
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { initTheme } from "@/utils/theme.ts";

@Options({})
export default class App extends Vue {
    created() {
        initTheme()
    }
}
</script>
