var webpack = require('webpack')
var conf = require('./webpack.prod.conf')

function onBuild(err, stats) { 
	if (err) throw console.log(err)
	process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
}

// returns a Compiler instance
var compiler = webpack(conf);

compiler.watch({}, onBuild);