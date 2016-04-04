var path = require('path')
var autoprefixer = require('autoprefixer');
var precss       = require('precss');

module.exports = {
  entry: {
    app: './www/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/static'),
    publicPath: '/static/',
    filename: 'bundle.[hash:8].js'
  },
  externals: {
      // require("jquery") is external and available
      //  on the global var jQuery
      'zepto': 'Zepto'
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      'www': path.resolve(__dirname, '../www')
    }
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  module: {
    loaders: [
      {
        test: /\.js(x)?$/,
        loader: 'babel?presets[]=react,presets[]=es2015',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  postcss: function () {
    return [autoprefixer, precss];
  }
}
