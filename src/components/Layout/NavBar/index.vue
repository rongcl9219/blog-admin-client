<template>
    <div class="nav-bar">
        <Hamburger
            :is-active="isSidebarOpen"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
        />
        <Breadcrumb class="breadcrumb-container" />
        <div class="right-menu">
            <ThemePicker />
            <el-dropdown class="avatar-container" trigger="click">
                <template #default>
                    <div class="avatar-wrapper">
                        <el-avatar
                            style="margin-right: 5px"
                            shape="square"
                            :size="40"
                        >
                            <img :src="userAvatar" alt="" />
                        </el-avatar>
                        <el-icon><CaretBottom /></el-icon>
                    </div>
                </template>
                <template #dropdown>
                    <el-dropdown-menu class="user-dropdown">
                        <el-dropdown-item @click="handleOpenUserInfoDialog"
                            >个人信息</el-dropdown-item
                        >
                        <el-dropdown-item
                            @click="updatePasswordDialog.visible = true"
                            >修改密码</el-dropdown-item
                        >
                        <el-dropdown-item divided @click="logout">
                            <span style="display: block">退出</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <el-dialog
        title="修改密码"
        v-model="updatePasswordDialog.visible"
        @close="closeUpdatePasswordDialog"
        :close-on-press-escape="false"
        :show-close="false"
        :close-on-click-modal="false"
    >
        <el-form
            ref="updatePasswordForm"
            :model="updatePasswordDialog.updatePasswordForm"
            status-icon
            :rules="updatePasswordDialog.rules"
            :label-width="150"
        >
            <el-form-item label="输入旧密码" prop="oldPass">
                <el-input
                    v-model="updatePasswordDialog.updatePasswordForm.oldPass"
                    placeholder="请输入旧密码"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="输入新密码" prop="newPass">
                <el-input
                    placeholder="密码必须包含且只能由数字和字母组成，长度8~16"
                    v-model="updatePasswordDialog.updatePasswordForm.newPass"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="再次输入新密码" prop="checkPass">
                <el-input
                    v-model="updatePasswordDialog.updatePasswordForm.checkPass"
                    placeholder="请再次输入密码"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="updatePasswordDialog.visible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="updatePass">确 定</el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog
        title="个人信息"
        @close="closeUserInfoDialog('updateUserInfoForm')"
        v-model="userInfoDialog.visible"
        :close-on-press-escape="false"
        :append-to-body="true"
        :close-on-click-modal="false"
    >
        <el-form
            ref="updateUserInfoForm"
            :model="userInfoDialog.userInfoForm"
            status-icon
            label-width="80px"
        >
            <el-form-item label="头像">
                <el-avatar
                    style="float: left; margin-right: 10px"
                    shape="square"
                    :size="50"
                >
                    <img :src="userInfoDialog.userInfoForm.avatarUrl" alt="" />
                </el-avatar>
                <el-button type="primary" @click="uploadAvatarVisible = true"
                    >上传头像</el-button
                >
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input
                    v-model="userInfoDialog.userInfoForm.email"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="个性签名">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 5 }"
                    v-model="userInfoDialog.userInfoForm.signature"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button @click="userInfoDialog.visible = false"
                    >取 消</el-button
                >
                <el-button
                    type="primary"
                    @click="handleUpdateUserInfo('updateUserInfoForm')"
                    >确 定</el-button
                >
            </div>
        </template>
    </el-dialog>

    <upload-avatar
        thumbnail="avatar"
        @crop-upload-success="uploadAvatarSuccess"
        @crop-upload-fail="uploadAvatarFail"
        v-model:upload-avatar-visible="uploadAvatarVisible"
    ></upload-avatar>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Getter, Action } from "vuex-class";
import defaultUserImg from "@/assets/images/default_img/default_user.png";
import Breadcrumb from "@/components/Layout/Breadcrumb/index.vue";
import Hamburger from "@/components/Layout/Hamburger/index.vue";
import ThemePicker from "@/components/ThemePicker/index.vue";
import UploadAvatar from "@/components/UploadAvatar/index.vue";
import { CaretBottom } from "@element-plus/icons";
import { ElFormItemContext } from "element-plus";
import { UserApi } from "@/api";

@Options({
    components: {
        Breadcrumb,
        Hamburger,
        CaretBottom,
        ThemePicker,
        UploadAvatar,
    },
})
export default class NavBar extends Vue {
    @Getter("setting/getSidebarOpen") isSidebarOpen: any;
    @Action("setting/toggleSideBar") toggleSideBar: any;

    /* region 用户头像 */
    @Getter("user/getAvatar") getAvatar: any;
    get userAvatar() {
        return this.getAvatar || defaultUserImg;
    }
    /* endregion */

    /* region 退出登录 */
    @Action("user/loginOut") loginOut: any;
    public logout() {
        this.$router.push({
            path: "/login",
            replace: true,
        });
    }
    /* endregion */

    /* region 修改密码 */
    public updatePasswordDialog = {
        visible: false,
        updatePasswordForm: {
            oldPass: "",
            newPass: "",
            checkPass: "",
        },
        rules: {
            oldPass: [
                { required: true, message: "请输入旧密码", trigger: "blur" },
            ],
            newPass: [
                {
                    validator: this.validatePassword(this),
                    required: true,
                    trigger: "blur",
                },
            ],
            checkPass: [
                {
                    validator: this.checkPassword(this),
                    required: true,
                    trigger: "blur",
                },
            ],
        },
    };
    public validatePassword(self: NavBar) {
        return (rule: any, value: any, callback: any) => {
            if (value.trim() === "") {
                callback(new Error("请输入新密码"));
            } else if (!/^(?![^a-zA-Z]+$)(?!\\D+$).{8,16}$/.test(value)) {
                callback(
                    new Error("密码必须包含且只能由数字和字母组成，长度8~16")
                );
            } else if (
                value !== self.updatePasswordDialog.updatePasswordForm.checkPass
            ) {
                self.updatePasswordDialog.updatePasswordForm.checkPass = "";
                callback(new Error("两次密码输入不一致"));
            } else {
                callback();
            }
        };
    }
    public checkPassword(self: NavBar) {
        return (rule: any, value: any, callback: any) => {
            if (value.trim() === "") {
                callback(new Error("请再次输入密码"));
            } else if (
                value !== self.updatePasswordDialog.updatePasswordForm.newPass
            ) {
                self.updatePasswordDialog.updatePasswordForm.checkPass = "";
                callback(new Error("两次密码输入不一致"));
            } else {
                (
                    self.$refs["updatePasswordForm"] as ElFormItemContext & {
                        validateField: any;
                    }
                ).validateField("newPass");
                callback();
            }
        };
    }
    public closeUpdatePasswordDialog() {
        (
            this.$refs["updatePasswordForm"] as ElFormItemContext & {
                resetFields: any;
            }
        ).resetFields();
    }
    public updatePass() {
        (
            this.$refs["updatePasswordForm"] as ElFormItemContext & {
                validate: any;
            }
        ).validate((valid: boolean | undefined) => {
            if (valid) {
                let data = {
                    oldPass:
                        this.updatePasswordDialog.updatePasswordForm.oldPass,
                    newPass:
                        this.updatePasswordDialog.updatePasswordForm.newPass,
                    checkPass:
                        this.updatePasswordDialog.updatePasswordForm.checkPass,
                };
                UserApi.updatePassword(data)
                    .then(() => {
                        this.$msg.success("修改成功");
                        this.$router.replace("/login");
                    })
                    .catch(() => {
                        this.$msg.error("修改失败");
                    });
            } else {
                return false;
            }
        });
    }
    /* endregion */

    /* region 个人信息 */
    @Action("user/setUserAvatar") setUserAvatar: any;
    public userInfoDialog = {
        visible: false,
        userInfoForm: {
            avatar: "",
            signature: "",
            email: "",
            avatarUrl: "",
            userId: "",
        },
    };
    public uploadAvatarVisible: boolean = false;
    handleOpenUserInfoDialog() {
        this.userInfoDialog.visible = true;
        UserApi.getUserInfo()
            .then((res) => {
                this.userInfoDialog.userInfoForm = res.data.userInfo;
            })
            .catch((err) => {
                this.$msg.error(err.msg || err.message);
            });
    }
    closeUserInfoDialog(formName: string) {
        (
            this.$refs[formName] as ElFormItemContext & {
                resetFields: any;
            }
        ).resetFields();
    }
    handleUpdateUserInfo() {
        const updateLoading = this.$loading({
            lock: true,
            text: "保存中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
        });

        let data = {
            avatar: this.userInfoDialog.userInfoForm.avatar,
            signature: this.userInfoDialog.userInfoForm.signature,
            email: this.userInfoDialog.userInfoForm.email,
            userId: this.userInfoDialog.userInfoForm.userId,
        };

        UserApi.updateUserInfo(data)
            .then(() => {
                this.$msg.success("修改成功");
                this.setUserAvatar(this.userInfoDialog.userInfoForm.avatarUrl);
                this.userInfoDialog.visible = false;
            })
            .catch(() => {
                this.$msg.error("修改失败");
            })
            .finally(() => {
                updateLoading.close();
            });
    }
    uploadAvatarSuccess(fileObj: any) {
        this.$msg.success("上传成功");
        this.userInfoDialog.userInfoForm.avatar = fileObj.key;
        this.userInfoDialog.userInfoForm.avatarUrl = fileObj.url;
    }
    uploadAvatarFail(error: any) {
        this.$msg.error(error.msg || "上传失败");
    }
    /* endregion */
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
