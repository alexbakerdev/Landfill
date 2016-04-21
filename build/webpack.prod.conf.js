var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
var projConfig = require('../config.js')

var config = merge(baseConfig, {
  plugins: [new UglifyJsPlugin({ minimize: true })]
})

config.output.filename = projConfig.libraryName + '.js'

module.exports = config
