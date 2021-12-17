import { Options, Vue, Ref } from "vue-property-decorator";
import { ElForm } from "element-plus";

@Options({})
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

    get webBannerUrl() {
        return this.form.webBanner.length > 0 ? '' : '';
    }

    created() {}
}
