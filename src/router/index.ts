import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Routers from "./modules/router";
import NProgress from "nprogress";
import store from "@/store";

const routes: Array<RouteRecordRaw> = Routers;

// 改变进度条的HTML结构
NProgress.configure({
    template: '<div class="bar" role="bar"><div class="peg"></div></div>',
});

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = store.state.common.token;
    NProgress.start();
    if (to.meta.requiresAuth) {
        if (token) {
            const userInfo = store.state.user.username;
            if (!userInfo) {
                store.dispatch("user/getUserInfo").then().catch();
            }
            next();
        } else {
            next({
                path: "/login",
                replace: true,
            });
        }
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done();
});

export default router;
