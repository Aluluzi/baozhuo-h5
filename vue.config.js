const path = require("path");

const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  publicPath: "./",
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  chainWebpack: (config) => {
    config.resolve.alias.set("_c", resolve("src/components"));
  },
  productionSourceMap: true,
  // css相关配置
  css: {},
  // webpack-dev-server 相关配置
  devServer: {
    proxy:{
      '/apis': {
        // target: 'http://localhost:8080',
        target: 'https://www.baozhuoyl.com',
        changeOrigin: true,
        pathRewrite: {
          '^/apis': '/'
        }
      },
    },
  },
  // PWA 插件相关配置
  pwa: {},
  // 第三方插件配置
  pluginOptions: {
    // ...
  },
  //webpack配置
  configureWebpack: {
    //关闭 webpack 的性能提示
    performance: {
      hints: false,
    },
  },
  //打包时可注释掉
  // configureWebpack: (config) => {
  //   config.devtool = "source-map";
  // },
};
