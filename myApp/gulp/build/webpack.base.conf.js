var path = require('path')

module.exports = {
  entry: {
    app: './www/js/app.js'
  },
  output: {
    path: path.resolve(__dirname, './../www/js'),
    publicPath: '',
    filename: 'js/[hash:8].[name].min.js'
  },
  externals: {
      // require("jquery") is external and available
      //  on the global var jQuery
      'zepto': 'Zepto'
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      'src': path.resolve(__dirname, '../www')
    }
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel!eslint',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
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
  eslint: {
    formatter: require('eslint-friendly-formatter')
  }
}
