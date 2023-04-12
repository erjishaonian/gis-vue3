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
})
