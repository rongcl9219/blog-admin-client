<template>
    <div class="login-container">
        <div class="login-card">
            <h3 class="title">后台登录</h3>
            <el-form
                ref="loginFormRef"
                class="login-form"
                :model="loginForm"
                :rules="loginFormRules"
                label-position="left"
            >
                <el-form-item prop="username">
                    <span class="login-icon">
                        <svg-icon icon-class="user" />
                    </span>
                    <el-input
                        v-model="loginForm.username"
                        placeholder="用户名"
                        type="text"
                    />
                </el-form-item>
                <el-form-item prop="password">
                    <span class="login-icon">
                        <svg-icon icon-class="password" />
                    </span>
                    <el-input
                        v-model="loginForm.password"
                        :type="passwordType ? 'password' : 'text'"
                        placeholder="密码"
                    />
                    <span
                        class="show-pwd"
                        @click="passwordType = !passwordType"
                    >
                        <svg-icon icon-class="eyes-close" v-if="passwordType"/>
                        <svg-icon icon-class="eyes" v-else/>
                    </span>
                </el-form-item>
                <el-form-item prop="validCode">
                    <div style="display: flex; align-items: center">
                        <span class="login-icon" style="margin-right: 5px">
                            <svg-icon icon-class="verification-code" />
                        </span>
                        <el-input
                            v-model="loginForm.validCode"
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
                    @click="handleLogin($event)"
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

<script src="./ts/index.ts"></script>

<style lang="scss">
$bg: #283443;
$light_gray: #222;
$cursor: #222;
$input_bg: #bcd4e1;
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
                box-shadow: 0 0 0 1000px $input_bg inset !important;
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
        background: $input_bg;
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
