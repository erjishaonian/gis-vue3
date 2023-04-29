const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       // scss-loader(8.0及以上)使用prependData
  //       prependData: `
  //         @import "@/assets/untils/color.scss';
  //       `,
  //     },
  //   },
  // },

  devServer: {
    /* 自动打开浏览器 */
    open: false,
    port: 8080, //本地端口号
    /* 使用代理 */
    proxy: {
      '/api': {
        target: 'http://localhost:3300',// 需要代理的后端接口
        changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        ws: true,
        pathRewrite: {//重写匹配的字段，如果不需要在请求路径上，重写为""
          '/api': ''
        }
      }
    },
  }
})
