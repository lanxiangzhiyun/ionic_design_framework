var webpack = require('webpack')
var config = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
config.devtool = 'eval-source-map'

// add hot-reload related code to entry chunk
config.entry.app = [
  'eventsource-polyfill',
  'webpack-hot-middleware/client?quiet=true&reload=true',
  config.entry.app
]

config.output.publicPath = '/'

config.plugins = (config.plugins || []).concat([
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    minify: {
      collapseWhitespace: true,
      removeComments: true
    },
    template: 'www/index.html'
  }),
  new BrowserSyncPlugin(
    // BrowserSync options
    {
      port: 8080,
      open: false,
      ui: false,
      proxy: 'http://172.16.77.129:8000/',
      files: ['www/templates/**'],
      logConnections: false,
      notify: false
    },
    // plugin options
    {
      reload: true
  })
])

module.exports = config
