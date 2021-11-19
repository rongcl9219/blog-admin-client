<template>
    <div class="login-container">
        <div class="login-card">
            <h3 class="title">后台登录</h3>
            <el-form
                ref="loginForm"
                class="login-form"
                :model="loginFormModel"
                :rules="loginFormRules"
                label-position="left"
            >
                <el-form-item prop="username">
                    <span class="login-icon">
                        <i class="el-icon-third-yonghu"></i>
                    </span>
                    <el-input
                        v-model="loginFormModel.username"
                        placeholder="用户名"
                        type="text"
                    />
                </el-form-item>
                <el-form-item prop="password">
                    <span class="login-icon">
                        <i class="el-icon-third-lock"></i>
                    </span>
                    <el-input
                        :key="passwordType"
                        v-model="loginFormModel.password"
                        :type="passwordType ? 'password' : 'text'"
                        placeholder="密码"
                    />
                    <span
                        class="show-pwd"
                        @click="passwordType = !passwordType"
                    >
                        <i
                            :class="
                                passwordType
                                    ? 'el-icon-third-yanjing_bi'
                                    : 'el-icon-third-yanjing'
                            "
                        ></i>
                    </span>
                </el-form-item>
                <el-form-item prop="validCode">
                    <div style="display: flex; align-items: center">
                        <span class="login-icon" style="margin-right: 5px">
                            <i class="el-icon-third-yanzhengma"></i>
                        </span>
                        <el-input
                            v-model="loginFormModel.validCode"
                            type="text"
                            autocomplete="off"
                            placeholder="验证码，不区分大小写"
                        ></el-input>
                        <ValidCode
                            v-model:valid-code="validCodeModel.validCode"
                            :refresh="validCodeModel.codeRefresh"
                        ></ValidCode>
                    </div>
                </el-form-item>
                <el-button
                    :loading="loading"
                    type="primary"
                    style="width: 100%; margin-bottom: 30px"
                    @click="handleLogin('loginForm', $event)"
                >
                    登录
                </el-button>
                <el-button
                    type="primary"
                    @click="initAdmin"
                    style="width: 100%; margin: 0"
                >
                    初始化管理员
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Action } from "vuex-class";
import { ElFormItemContext } from "element-plus";
import ValidCode from "@/components/ValidCode/index.vue";
import { UserApi } from "@/api";

@Options({
    components: {
        ValidCode,
    },
})
export default class Login extends Vue {
    @Action("user/login") login: any;
    @Action("user/loginOut") loginOut: any;

    public loginFormModel = {
        username: "",
        password: "",
        validCode: "",
    };
    public loginFormRules = {
        username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        validCode: [
            {
                validator: this.checkValidCode(this),
                required: true,
                trigger: "blur",
            },
        ],
    };
    public validCodeModel = {
        validCode: "",
        codeRefresh: 0,
    };
    public loading: boolean = false;
    private passwordType: boolean = true;
    private loginLock: boolean = false;

    public checkValidCode(self: Login) {
        return (rule: any, value: any, callback: any) => {
            if (!value || value.trim() === "") {
                callback(new Error("请输入验证码"));
            } else if (
                value.toLocaleUpperCase() !==
                self.validCodeModel.validCode.toLocaleUpperCase()
            ) {
                ++self.validCodeModel.codeRefresh;
                callback(new Error("验证码错误"));
            } else {
                callback();
            }
        };
    }

    public handleLogin(formName: string, event?: any) {
        if (event) {
            // 去除按钮聚焦，否则先点击按钮在按回车会重复触发事件
            let target = event.target;
            if (target.nodeName === "SPAN" || target.nodeName === "I") {
                target = event.target.parentNode;
            }
            target.blur();
        }

        if (this.loginLock) {
            return false;
        }
        this.loginLock = true;
        this.loading = true;

        (
            this.$refs[formName] as ElFormItemContext & { validate: any }
        ).validate((valid: boolean | undefined) => {
            if (valid) {
                let data = {
                    username: this.loginFormModel.username,
                    password: this.loginFormModel.password,
                };

                this.login(data)
                    .then(() => {
                        this.$router.push("/");
                    })
                    .catch((error: any) => {
                        this.$msg.error(error.msg);
                        this.validCodeModel.codeRefresh++;
                        this.loading = false;
                        this.loginLock = false;
                    });
            } else {
                this.loading = false;
                this.loginLock = false;
                return false;
            }
        });
    }

    public handleKeyup(e: any) {
        if (e.keyCode === 13 && e.target.baseURI.match(/login/)) {
            this.handleLogin("loginForm"); // 调用登录 验证方法
        }
    }

    public initAdmin() {
        UserApi.initSysAdmin()
            .then((res) => {
                this.$msg.success(
                    `初始化成功！用户名为：${res.data.username}，密码为：${res.data.password}`
                );
            })
            .catch((error) => {
                this.$msg.error(error.msg || "初始化失败");
            });
    }

    created() {
        this.loginOut().then().catch();

        document.addEventListener("keyup", this.handleKeyup);
    }

    unmounted() {
        document.removeEventListener("keyup", this.handleKeyup);
    }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #222;
$cursor: #222;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
            background: transparent;
            border: 0;
            -webkit-appearance: none;
            border-radius: 0;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;
            &:-webkit-autofill {
                box-shadow: 0 0 0 1000px #bcd4e1 inset !important;
                -webkit-text-fill-color: $bg !important;
            }
            &::-webkit-input-placeholder {
                color: gray;
            }
            &::-moz-placeholder {
                color: gray;
            }
            &::-ms-input-placeholder {
                color: gray;
            }
        }
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>
<style scoped lang="scss">
.login-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    user-select: none;
    &:after {
        z-index: -1;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("~@/assets/images/default_img/login_bg.jpg");
        background-origin: revert;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
    .login-card {
        position: relative;
        width: 600px;
        height: 500px;
        padding: 0 20px;
        box-sizing: border-box;
        box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.25);
        .title {
            margin: 20px 0;
            font-size: 26px;
            letter-spacing: 10px;
            text-align: center;
            font-family: 华文楷体, "Microsoft Yahei", SimSun, "Arial Narrow",
                serif;
            font-weight: bold;
        }
        .login-icon {
            margin-left: 20px;
            font-size: 16px;
        }
        .show-pwd {
            font-size: 16px;
            cursor: pointer;
        }
    }
}
</style>
