var path = require('path');
var webpack = require('webpack');

module.exports = {
  devServer: {
    contentBase: path.resolve(__dirname),
    publicPath: '/dist/',
    hot: true
  },

  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:9000/',
    'webpack/hot/only-dev-server',
    './src/App.js'
  ],

  output: {
    path: path.join( __dirname, '/dist'), //这里配置打包路径
    publicPath: '/dist/',
    filename: "bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}