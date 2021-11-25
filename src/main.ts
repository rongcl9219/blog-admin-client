import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import resetMessage from "@/utils/resetMessage";

import ElementPlus from "element-plus";
import "element-plus/theme-chalk/src/index.scss";
import "@/style/theme/index.scss";
import "@/style/reset.scss";

import "@/svg";

import SvgIcon from "@/components/SvgIcon/index.vue";

const app = createApp(App);

app.config.globalProperties.$msg = resetMessage;

app.component("svg-icon", SvgIcon)
    .use(ElementPlus, { size: "small" })
    .use(store)
    .use(router)
    .mount("#app");
