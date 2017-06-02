var path = require('path');
var webpack = require('webpack');

module.exports = {
  devServer: {
    contentBase: path.resolve(__dirname),
    publicPath: '/dist/',
    hot: true,
    historyApiFallback: true,
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
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'url-loader?limit=40000'
      }
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