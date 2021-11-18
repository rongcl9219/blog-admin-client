const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

module.exports = {
    publicPath: "/",
    assetsDir: "static",
    lintOnSave: true,
    runtimeCompiler: true,
    productionSourceMap: false,
    configureWebpack: (config) => {
        const plugins = [];

        if (IS_PROD) {
            // 打包文件大小警告配置
            config.performance = {
                hints: false,
            };

            /* region 开启gzip */
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: "[path].gz[query]",
                    algorithm: "gzip",
                    test: productionGzipExtensions,
                    threshold: 10240, // 对超过10k的数据进行压缩
                    minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                    deleteOriginalAssets: false, // 删除原文件
                })
            );
            /* endregion */

            config.plugins = [...config.plugins, ...plugins];
        }
    },
    chainWebpack: (config) => {
        // html中添加cdn
        config.plugin("html").tap((args) => {
            args[0].title = "火星的青青草原";
            return args;
        });

        // 修复HMR
        config.resolve.symlinks(true);

        if (IS_PROD) {
            // 移除 prefetch 插件
            config.plugins.delete("prefetch");
        }
    },
    devServer: {
        overlay: {
            // 让浏览器 overlay 同时显示警告和错误
            warnings: true,
            errors: true,
        },
        open: false, // 是否打开浏览器
        host: "localhost",
        port: "5000", // 端口
        https: false,
        hotOnly: false, // 热更新
        proxy: {
            "/api": {
                target: "http://localhost:90/", // 目标代理接口地址
                ws: false, // 如果代理websockets，需要配置这个参数
                secure: false, // https接口，需要配置这个参数
                changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
                pathRewrite: {
                    // 路径重写
                    "^/api": "/",
                },
            },
        },
    },
};
