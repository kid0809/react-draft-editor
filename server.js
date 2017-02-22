var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')

var config = require('./webpack.config.js')

var compiler = webpack(config)

var server = new WebpackDevServer(compiler, config.devServer)

server.listen(9000, (err) => {
  if (err) {
    console.log(err)
  }

  console.log('Listening at localhost:9000')
})
