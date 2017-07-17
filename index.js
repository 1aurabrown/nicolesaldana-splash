var express = require('express')
var stylus = require('stylus')
var coffee = require('express-coffee-script')
var nib = require('nib')
var app = express()

app.set('view engine', 'pug')
app.set('port', (process.env.PORT || 3000))

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib())
}

// tell node to compile.styl-files to normal css-files
app.use(stylus.middleware({
  src: __dirname + '/assets/styles',
  dest: __dirname + '/public/css',
  compile: compile
}))

app.use(coffee({
  src: __dirname + '/assets/coffee',
  dest:  __dirname + '/public/js',
  prefix: '/js',
  compilerOpts: { bare: true }
}))

app.use(express.static(__dirname + '/public'))

// render splash page
app.get('/', function(req, res) {
  res.render('index')
})

// start the app
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
