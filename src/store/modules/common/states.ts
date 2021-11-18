import {
    cacheAccessToken,
    cacheRefreshToken,
    cacheTokenExp,
    commentUserInfo,
} from "@/utils/storageCache";

export interface CommonState {
    token?: any;
    refreshToken?: any;
    tokenExp?: any;
    commentUser?: any;
    asideWebInfo?: any;
}

export const state: CommonState = {
    token: cacheAccessToken.load() || null,
    refreshToken: cacheRefreshToken.load() || null,
    tokenExp: cacheTokenExp.load() || null,
    commentUser: commentUserInfo.load() || null,
    asideWebInfo: {},
};
