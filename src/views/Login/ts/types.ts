export interface LoginForm {
    username: "";
    password: "";
    validCode: "";
}

export interface ValidCodeModel {
    validCode: string;
    codeRefresh: number;
}

export interface RuleItem {
    required: boolean;
    message?: string;
    validator?: (
        rule: any,
        value: any,
        callback: (message?: Error | string) => void
    ) => void;
    trigger: string | string[];
}

export interface FormRule {
    [key: string]: Array<RuleItem>;
}
