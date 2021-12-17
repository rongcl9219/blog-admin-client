export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

export interface DialogModel {
    dialogVisible: boolean;
    isNew: boolean;
    title: string;
    loading: boolean;
    saveFlag: boolean;
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
