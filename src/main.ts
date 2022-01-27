import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import resetMessage from "@/utils/resetMessage";
import * as Core from "@/core/utils";
import globalUIComponents from "@/global/UIComponents";
import globalComponents from "@/global/components";
import globalDirectives from "@/global/directives";
import globalMixins from "@/global/mixins";
import zhCn from "element-plus/es/locale/lang/zh-cn";
const app = createApp(App);

app.config.globalProperties.$msg = resetMessage;

Core.components(app, globalComponents);
Core.directives(app, globalDirectives);
Core.mixin(app, globalMixins);

app.use(globalUIComponents, {locale: zhCn})
    .use(store)
    .use(router)
    .mount("#app");
