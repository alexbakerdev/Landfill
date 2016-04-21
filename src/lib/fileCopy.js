import fs from 'mz/fs'
import ncp from './ncp'
import mkdirp from 'mkdirp'
import { template } from 'lodash'
import { Transform } from 'stream'

/**
 * TemplateStream is a Transform that
 * applies lodash templating to streams.
 */
class TemplateStream extends Transform {
  constructor (props, enc) {
    super({ objectMode: true })
    this.contents = ''
    this.props = props
    this.enc = enc
  }

  _transform (chunk, enc, cb) {
    let string = (typeof chunk === typeof 'string')
      ? new Buffer(chunk, this.enc)
      : chunk
    this.contents += string
    cb()
  }

  _flush (cb) {
    let compiler = template(this.contents)
    let test = compiler(this.props)
    this.push(test)
    cb()
  }
}

function pipeTemplate (props, encoding, templateRegex) {
  return function (read, write) {
    if (read.path.match(templateRegex)) {
      read
        .pipe(new TemplateStream(props, encoding))
        .pipe(write)
    } else {
      read.pipe(write)
    }
  }
}

export function applyTemplate (source, destination, opts) {
  ncp.limit = 16
  // resolve options
  let props = opts.props || {}
  let encoding = opts.encoding || 'utf8'
  let skip = opts.skip
  let templateRegex = opts.template

  let options =
    { transform: pipeTemplate(props, encoding, templateRegex)
    , rename: function (target) { return template(target)(props) }
    }

  // if skip regex, or function defined add to
  // ncp options
  if (skip) options.filter = skip

  return fs.exists(destination)
    .then((exists) => {
      if (exists) return
      return promiseMkdirp(destination)
    }).then(() => {
      return new Promise((resolve, reject) => {
        ncp(source, destination, options, function (err) {
          if (err) reject(err)
          resolve(true)
        })
      })
    })
}

function promiseMkdirp (dir) {
  return new Promise((resolve, reject) => {
    mkdirp(dir, (err) => {
      if (err) reject(err)
      resolve(true)
    })
  })
}
