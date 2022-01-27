import { Pagination } from "@/api/commonTypes";

/**
 * 文章列表接口参数
 */
export interface ArticleList extends Pagination {
    query?: string;
    classType?: string;
    tagType?: string;
    articleStatus?: number;
}

/**
 * 文章信息接口参数
 */
export interface ArticleInfo {
    articleId?: string;
    articleTitle: string;
    articleSubtitle?: string;
    articleKeyword: string;
    articleInfo: string;
    articleCover: string | Array<any>;
    classType: string | number[];
    tagType: string | number[];
}
