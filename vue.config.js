// const webpack = require('webpack')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const merge = require('lodash.merge')
const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'
const target = TARGET_NODE ? 'server' : 'client'
const path = require('path')
const plugins = TARGET_NODE ? [new VueSSRServerPlugin()] : [new VueSSRClientPlugin()]
module.exports = {
  css: {
    // vue-cli 和ssr对data-v的计算有差异，得到修复前不要分离
    extract: true,
    // vue-cli 和ssr打包生成client-manifest.json时总会检查map，得到修复前不要取消map
    sourceMap: true
  },
  // 站点地址+static
  publicPath: '/news/static/',
  configureWebpack: config => {
    config.entry.app.unshift('@babel/polyfill')
    // console.log(config.entry.app, 'config.entry.app')
    return ({

      // 将 entry 指向应用程序的 server / client 文件
      entry: `./src/entry-${target}.js`,
      // entry: ['@babel/polyfill', `./src/entry-${target}.js`],
      // 对 bundle renderer 提供 source map 支持
      devtool: 'source-map',
      target: TARGET_NODE ? 'node' : 'web',
      node: TARGET_NODE ? undefined : false,
      output: {
        libraryTarget: TARGET_NODE ? 'commonjs2' : undefined
      },
      // https://webpack.js.org/configuration/externals/#function
      // https://github.com/liady/webpack-node-externals
      // 外置化应用程序依赖模块。可以使服务器构建速度更快，
      // 并生成较小的 bundle 文件。
      externals: TARGET_NODE
        ? nodeExternals({
          // 不要外置化 webpack 需要处理的依赖模块。
          // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
          // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
          whitelist: [/\.css$/]
        })
        : undefined,
      optimization: {
        splitChunks: {
          name: 'manifest',
          minChunks: Infinity
        }
      },
      plugins: plugins
    })
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        merge(options, {
          optimizeSSR: false
        })
      })
  }
}
