import path from 'path'
import fs from 'mz/fs'
import { merge, isArray } from 'lodash'
import semver from 'semver'
import resolve from 'resolve'
import { spawn } from 'child_process'
import chalk from 'chalk'
import dedent from 'dedent-js'

// How to load different config file types
// Each option should return promises of configs
// Not every config should have a version specified.
let configFiles =
  { 'package.json':
      function (filePath) {
        return fs.readFile(filePath, 'utf8')
          .then(JSON.parse)
          .then(pkgJson => {
            let config =
              { templates: pkgJson.landfill.templates
              , version:
                  pkgJson.devDependencies.landfill ||
                  pkgJson.dependencies.landfill ||
                  false
              }
            return config
          })
      }
  }

export function continueWithCorrectVersion (templateConfig) {
  if (!templateConfig.version || semver.satisfies(GLOBAL.version, templateConfig.version)) {
    // This version of landfill satisfies
    // package.json config (or no version specified in template)
    if (GLOBAL.debug) console.log('Using landfill -v', GLOBAL.version)
    if (GLOBAL.debug && !templateConfig.version) console.log('no version of landfill specified by template')

    // execution should continue
    return true
  } else {
    // This version of landfill does
    // not satisfy package.json
    let delim = (process.platform === 'win32' ? ';' : ':')
    let paths = (process.env.NODE_PATH ? process.env.NODE_PATH.split(delim) : [])
    // Use node resolve alogrithm to find
    // local version of landfill
    resolve('landfill', { basedir: templateConfig.configDir, paths: paths }, (err, res) => {
      if (err) {
        // if there is an error, module cannot be found
        let errorString = dedent `
          Landfill could not resolve a local version of itself
          with basedir ${chalk.cyan(templateConfig.configDir)}
          using NODE_PATH(s):
          `
        paths.forEach((path) => {
          errorString += `\t${chalk.yellow(path)}\n`
        })
        throw new Error(errorString)
      }

      // Found matching module
      if (GLOBAL.debug) {
        let debugString = dedent `
        Initialised version of landfill: ${chalk.blue(GLOBAL.version)} does not satisfy requirement ${chalk.blue(templateConfig.version)}
        Respawning with local package version at ${chalk.cyan(path.relative(templateConfig.configDir, res))}`
        console.log(debugString)
      }

      // get options passed to this landfill instance
      let options = process.argv.slice(2)

      // exec local landfill version-safe with same options
      spawn('node'
        , [res, '-s', templateConfig.version].concat(options)
        , { cwd: path.resolve(process.cwd())
          , stdio: 'inherit'
          }
        )
    })

    // stop this process
    return false
  }
}

export function configLoader () {
  // Keep dictionary of parent directories and config files
  let ancestry = {}

  // Get cwd
  let cwd = path.resolve(process.cwd())
  let currentPath = path.sep // start at disk root

  // get ancestry
  for (var i = 0; i < pathSep(cwd).length; i++) {
    currentPath = path.join(currentPath, pathSep(cwd)[i]) // go one directory deeper
    ancestry[pathSep(cwd).length - i - 1] = { path: currentPath } // cwd should have key 0
  }

  return Promise.all(
    Object.keys(ancestry).map((rank, index) => {
      // look through cwd ancestry and check
      // each ancestor for config files
      let ancestor = ancestry[rank]
      return loadConfig(ancestor.path)
        .then(result => {
          if (result) {
            // ancestor directory has config
            ancestor = merge(ancestor, result)
          } else {
            // remove ancestor from ancestry
            delete ancestry[rank]
          }
        })
    })
  ).then(() => {
    return { ancestry: ancestry }
  })
}

export function matchTemplateAndVersion (templateName, ancestry) {
  ancestry.current = 0
  let templateConfig = {}
  let foundTemplate = false

  // find closest ancestor reference to templatename
  do {
    let currentConfig = getCurrentConfig(ancestry)
    if (currentConfig.templates[templateName]) {
      templateConfig.template = currentConfig.templates[templateName]
      templateConfig.configDir = currentConfig.path
      foundTemplate = true
      break
    }
  } while (ascendAncestry(ancestry))

  // starting from where we found the template name
  // find closest ancestor version of landfill
  do {
    let currentConfig = getCurrentConfig(ancestry)
    if (currentConfig.version) {
      templateConfig.version = currentConfig.version
      break
    }
  } while (ascendAncestry(ancestry))

  return (foundTemplate) ? templateConfig : false
}

function getCurrentConfig (ancestry) {
  return ancestry.ancestry[ancestry.current]
}

function ascendAncestry (ancestry) {
  let all = Object.keys(ancestry.ancestry).sort()
  let nextIndex = all.indexOf(ancestry.current) + 1
  if (nextIndex < all.length) {
    ancestry.current = all[nextIndex]
    return all[nextIndex]
  } else {
    return false
  }
}

/**
 * Utils
 */

/**
 * Looks for each config type, and returns
 * a promise which resolves with a config object
 * @param  {String} dir    - absolute path to search for configs in
 * @return {Promise|false} - resolves with config for a directory, or if there is none, returns false
 */
function loadConfig (dir) {
  let result = {}
  let hasConfig = false
  // Prallel promises, for io with
  // mutilple config files
  return Promise.all(
    // reduce all configs into one
    Object.keys(configFiles)
      .map((configType, index) => {
        let file = path.join(dir, configType)
        // maps configTypes to promises
        // that resolve configs or false
        return fs.exists(file).then(exists => {
          if (exists) {
            // this directory does have a config file
            hasConfig = true
            // load config type using mapped method
            return configFiles[configType](file)
          }
          return false
        }).then(config => {
          if (config) {
            // merge each config with result
            result = merge(result, config, mergeArrays)
          }
        })
      })
  // After all configs resolve
  ).then(() => {
    return (hasConfig) ? result : false
  })
}

function mergeArrays (objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

function pathSep (p) {
  return p.split(path.sep)
}
