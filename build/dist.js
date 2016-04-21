var webpack = require('webpack')
var conf = require('./webpack.prod.conf')

webpack(conf, function(err, stats) { 
	if (err) throw console.log(err)
	process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
});