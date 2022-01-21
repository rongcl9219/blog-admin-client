import { Options, Vue, Ref } from "vue-property-decorator";
import { ElForm } from "element-plus";
import UploadAvatar from "@/components/UploadAvatar/index.vue";
import { Plus } from "@element-plus/icons";
import UploadImage from "@/components/UploadImage/index.vue";

@Options({
    components: {
        UploadAvatar,
        UploadImage,
        Plus
    }
})
export default class WebInfo extends Vue {
    @Ref() readonly webInfoFormRef!: typeof ElForm;

    public upLoadImgVisible: boolean = false;
    public uploadAvatarVisible: boolean = false;
    public globalLoading: boolean = false;

    public form = {
        webUser: '',
        githubLink: '',
        avatar: {
            url: '',
            key: ''
        },
        webBanner: [],
        motto: '',
        personalDesc: '',
        webDesc: ''
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

    get webBannerUrl() {
        return this.form.webBanner.length > 0 ? '' : '';
    }

    onSubmit() {
        console.log(1);
    }
}
