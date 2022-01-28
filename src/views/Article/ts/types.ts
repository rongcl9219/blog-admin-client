export interface Optinon {
    value: number;
    label: string;
}

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

export interface DialogModel {
    title: string;
    isEdit: boolean;
    visible: boolean;
    btnLoading: boolean;
    formLoading: boolean;
    uploadImgVisible: boolean;
    tagTypeOptions: Array<any>;
}

interface RuleItem {
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

export interface EditModel {
    articleId: string;
    articleContent: string;
    mdEditorVisible: boolean;
}
