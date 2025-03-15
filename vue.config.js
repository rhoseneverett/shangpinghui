const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/shangpinghui/'
    : '/',
  productionSourceMap: false,
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    proxy: {
         '/api': {
              target: 'http://gmall-h5-api.atguigu.cn',
         },
    },
  }
})