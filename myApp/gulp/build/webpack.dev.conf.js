var webpack = require('webpack')
var config = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
config.devtool = 'eval-source-map'

// add hot-reload related code to entry chunk
config.entry.app = [
  'webpack-dev-server/client?http://0.0.0.0:9090',//资源服务器地址
  'webpack-hot-middleware/client?quiet=true&reload=true',
  config.entry.app
]

config.output.publicPath = 'publicPath: "http://127.0.0.1:9090/static/dist/"'

config.plugins = (config.plugins || []).concat([
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'www/index.html'
  })
])

module.exports = config
