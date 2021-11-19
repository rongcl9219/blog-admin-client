<template>
    <div class="nav-bar">
        <Hamburger
            :is-active="isSidebarOpen"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
        />
        <Breadcrumb class="breadcrumb-container" />
        <div class="right-menu">
            <ThemePicker/>
            <el-dropdown class="avatar-container" trigger="click">
                <template #default>
                    <div class="avatar-wrapper">
                        <el-avatar
                            style="margin-right: 5px;"
                            shape="square"
                            :size="40"
                        >
                            <img :src="userAvatar" alt="" />
                        </el-avatar>
                        <el-icon><CaretBottom/></el-icon>
                    </div>
                </template>
                <template #dropdown>
                    <el-dropdown-menu class="user-dropdown">
                        <el-dropdown-item>个人信息</el-dropdown-item>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item>
                            <span style="display: block">退出</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Getter, Action } from "vuex-class";
import defaultUserImg from "@/assets/images/default_img/default_user.png";
import Breadcrumb from "@/components/Layout/Breadcrumb/index.vue";
import Hamburger from "@/components/Layout/Hamburger/index.vue";
import ThemePicker from "@/components/ThemePicker/index.vue";
import { CaretBottom } from '@element-plus/icons'

@Options({
    components: {
        Breadcrumb,
        Hamburger,
        CaretBottom,
        ThemePicker
    },
})
export default class NavBar extends Vue {
    @Getter("setting/getSidebarOpen") isSidebarOpen: any;
    @Getter("user/getAvatar") getAvatar: any;
    @Action("setting/toggleSideBar") toggleSideBar: any;

    public pathTo() {
        this.$router.push({
            name: "AdminClass",
        });
    }

    get userAvatar() {
        return this.getAvatar || defaultUserImg;
    }
}
</script>

<style lang="scss" scoped>
.nav-bar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        line-height: 50px;

        .link-home {
            margin-right: 20px;
            transition: 0.3s;
        }

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin: 0 20px 0 10px;

            .avatar-wrapper {
                cursor: pointer;
            }
        }
    }
}
</style>
