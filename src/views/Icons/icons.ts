const reqIcons = require.context("../../svg/icons", false, /\.svg$/);

const requireIcons = (req: any): string[] => {
    const imageModule: string[] = [];

    req.keys().forEach((key: string) => {
        const newKey = key.replace(/(\.\/|\.svg)/g, "");
        imageModule.push(newKey);
    });

    return imageModule;
};

const iconList: string[] = requireIcons(reqIcons);

export default iconList;
