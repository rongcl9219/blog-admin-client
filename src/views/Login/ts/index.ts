import { Options, Vue, Ref } from "vue-property-decorator";
import { Action } from "vuex-class";
import { ElForm } from "element-plus";
import ValidCode from "@/components/ValidCode/index.vue";
import { UserApi } from "@/api";
import { LoginForm, ValidCodeModel, FormRule } from "./types";
import { CustomResponse } from "@/core/request/type";

@Options({
    name: "Login",
    components: {
        ValidCode,
    },
})
export default class Login extends Vue {
    @Ref() readonly loginFormRef!: typeof ElForm;

    @Action("user/login") login: (data: LoginForm) => Promise<CustomResponse>;
    @Action("user/loginOut") loginOut: () => Promise<CustomResponse>;

    public loginForm: LoginForm = {
        username: "",
        password: "",
        validCode: "",
    };
    public loginFormRules: FormRule = {
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
    public validCodeModel: ValidCodeModel = {
        validCode: "",
        codeRefresh: 0,
    };
    public loading: boolean = false;
    private loginLock: boolean = false;
    private passwordType: boolean = true;

    /**
     * 校验验证码
     * @param self
     */
    public checkValidCode(self: Login) {
        return (
            rule: any,
            value: any,
            callback: (message?: Error | string) => void
        ) => {
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

    /**
     * 登录
     */
    public handleLogin(event?: PointerEvent) {
        if (event) {
            // 去除按钮聚焦，否则先点击按钮在按回车会重复触发事件
            let target = event.target as HTMLElement;
            if (target.nodeName === "SPAN" || target.nodeName === "I") {
                target = target.parentElement as HTMLElement;
            }
            target.blur();
        }

        if (this.loginLock) {
            return false;
        }
        this.loginLock = true;
        this.loading = true;

        this.loginFormRef
            .validate()
            .then(() => {
                const data = Object.assign({}, this.loginForm);

                this.login(data)
                    .then(() => {
                        this.$router.push("/").then();
                    })
                    .catch((error) => {
                        this.$msg.error(error.msg);
                        this.validCodeModel.codeRefresh++;
                        this.loading = false;
                        this.loginLock = false;
                    });
            })
            .catch(() => {
                this.loading = false;
                this.loginLock = false;
            });
    }

    /**
     * 回车
     */
    public handleKeyup(e: KeyboardEvent) {
        // 将target装换为对应的HTML元素
        const target = e.target as HTMLElement;
        if (e.keyCode === 13 && target.baseURI.match(/login/)) {
            this.handleLogin(); // 调用登录 验证方法
        }
    }

    /**
     * 初始化管理员
     */
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
        this.loginOut()
            .then()
            .catch();

        document.addEventListener("keyup", this.handleKeyup);
    }

    unmounted() {
        document.removeEventListener("keyup", this.handleKeyup);
    }
}
