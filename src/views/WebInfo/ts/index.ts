import { Options, Vue, Ref } from "vue-property-decorator";
import { ElForm } from "element-plus";
import UploadAvatar from "@/components/UploadAvatar/index.vue";
import { Plus } from "@element-plus/icons-vue";
import UploadImage from "@/components/UploadImage/index.vue";
import ViewImage from "@/components/ViewImage/index.vue";
import { WebInfoApi } from "@/api";

interface Avatar {
    url: string;
    key: string;
}

interface WebBanner {
    [index: string]: any;
}

interface WebInfoForm {
    webUser: string;
    githubLink: string;
    avatar: Avatar;
    webBanner: Array<WebBanner>;
    motto: string;
    personalDesc: string;
    webDesc: string;
}

@Options({
    components: {
        UploadAvatar,
        UploadImage,
        Plus,
        ViewImage
    }
})
export default class WebInfo extends Vue {
    @Ref() readonly webInfoFormRef!: typeof ElForm;

    public upLoadImgVisible: boolean = false;
    public uploadAvatarVisible: boolean = false;
    public globalLoading: boolean = false;

    public form: WebInfoForm = {
        webUser: "",
        githubLink: "",
        avatar: {
            url: "",
            key: ""
        },
        webBanner: [],
        motto: "",
        personalDesc: "",
        webDesc: ""
    };

    public loadingText: string = "加载中...";

    uploadAvatarSuccess(fileObj: any) {
        this.$msg.success("上传成功");
        this.form.avatar.key = fileObj.key;
        this.form.avatar.url = fileObj.url;
    }

    uploadAvatarFail(error: any) {
        this.$msg.error(error.msg || "上传失败");
    }

    onSubmit() {
        console.log(1);
        this.loadingText = "保存中...";
        this.globalLoading = true;

        const webBanner = this.form.webBanner && this.form.webBanner.length > 0 ? this.form.webBanner[0].key : "";

        const paramObj = {
            WEB_USER: this.form.webUser,
            GITHUB_LINK: this.form.githubLink,
            WEB_AVATAR: this.form.avatar.key,
            PERSONAL_DESC: this.form.personalDesc,
            WEB_DESC: this.form.webDesc,
            MOTTO: this.form.motto,
            WEB_BANNER: webBanner
        };

        WebInfoApi.saveWebInfo({ paramObj }).then(() => {
            this.$msg.success("保存成功");
        }).catch(() => {
            this.$msg.error("保存失败");
        }).finally(() => {
            this.globalLoading = false;
        });
    }

    mounted() {
        this.globalLoading = true;
        WebInfoApi.getWebInfo().then(res => {
            const paramData = res.data.paramData;
            this.form.webUser = paramData.WEB_USER || "";
            this.form.githubLink = paramData.GITHUB_LINK || "";
            this.form.personalDesc = paramData.PERSONAL_DESC || "";
            this.form.webDesc = paramData.WEB_DESC || "";
            this.form.motto = paramData.MOTTO || "";
            if (paramData.WEB_AVATAR) {
                this.form.avatar = paramData.WEB_AVATAR;
            }
            if (paramData.WEB_BANNER) {
                this.form.webBanner.push(paramData.WEB_BANNER);
            }
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.globalLoading = false;
        });
    }
}
