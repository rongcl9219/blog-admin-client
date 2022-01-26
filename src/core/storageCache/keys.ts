interface Keys {
    [key: string]: string;
}

const KEYS: Keys = {
    accessToken: "ak",
    refreshToken: "rk",
    tokenExp: "exp",
    commentUser: "commentUser",
    theme: "adminTheme",
};

const NameSpace = "MY_BLOG";

for (const key in KEYS) {
    if (Object.prototype.hasOwnProperty.call(KEYS, key)) {
        KEYS[key] = `${NameSpace}:${key}`.toUpperCase();
    }
}

export default KEYS;
