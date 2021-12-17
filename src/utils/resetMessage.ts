import { ElMessage } from "element-plus";

let messageInstance: any = null;
const Message: any = (options: any) => {
    if (messageInstance) {
        messageInstance.close();
    }
    messageInstance = ElMessage(options);
};

["error", "success", "info", "warning"].map((type: string) => {
    Message[type] = (options: any) => {
        if (typeof options === "string") {
            options = {
                message: options,
            };
        }
        options.type = type;
        return Message(options);
    };
});

export default Message;
