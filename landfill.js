var landfill = require('./dist/landfill')

var opts =
  { props: {AppName: 'App Name'}
  , ignore: /.png$/i
  }

landfill.applyTemplate('./template', './testing', opts).then(function () {
  console.log('template')
})
