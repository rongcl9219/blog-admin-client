import Clipboard from "clipboard";
import { ElMessage } from "element-plus";

const clipboardSuccess = (): void => {
    ElMessage({
        type: "success",
        message: "复制成功",
        duration: 1500,
    });
};

const clipboardError = (): void => {
    ElMessage({
        type: "error",
        message: "复制失败",
        duration: 1500,
    });
};

const handleClipboard = (text: string, event: PointerEvent) => {
    const target = event.target as HTMLElement;
    const clipboard: any = new Clipboard(target, {
        text: () => text,
    });
    clipboard.on("success", () => {
        clipboardSuccess();
        clipboard.destroy();
    });
    clipboard.on("error", () => {
        clipboardError();
        clipboard.destroy();
    });
    clipboard.onClick(event);
};

export default handleClipboard;
