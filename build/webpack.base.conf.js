var path = require('path')
var webpack = require('webpack')
var ExternalsPlugin = require('webpack-externals-plugin')
var projConfig = require('../config.js')
var WrapperPlugin = require('wrapper-webpack-plugin')

var definePlugin = new webpack.DefinePlugin({
  __DEV__: process.env.DEV || false
})

var config = {
  entry: ['babel-polyfill', path.resolve(projConfig.entry)],
  target: 'node',
  output: {
    path: path.resolve('dist'),
    library: projConfig.libraryName,
    libraryTarget: 'commonjs2'
  },
  devtool: 'source-map',
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules)/
      }
    ]
  },
  resolve: {
    root: path.resolve(projConfig.entry),
    extensions: ['', '.js']
  },
  plugins:
    [ new WrapperPlugin({ header: '#!/usr/bin/env node\n' +
                                  'GLOBAL.require = require;\n' +
                                  'GLOBAL.__dirname = __dirname;\n' +
                                  'GLOBAL.version = require(\'../package.json\').version;\n'

      }),
      new ExternalsPlugin({
        type: 'commonjs2',
        include: path.resolve('node_modules')
      }),
      definePlugin
    ]
}

module.exports = config
