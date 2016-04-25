import path from 'path'

import program from 'commander'
import semver from 'semver'
import chalk from 'chalk'
import dedent from 'dedent-js'
import { merge } from 'lodash'

import
  { configLoader
  , matchTemplateAndVersion
  , continueWithCorrectVersion
  } from './lib/configLoader'

import landfill from './landfill'

program
  .version(GLOBAL.version)

program
  .command('list')
  .description('List all available templates by name')
  .option('-a, --all', 'list all available information, Name, Config Dir, Template Dir')
  .action(function (nothing, options) {
    listTemplates()
  })

program
  .command('fill <template>')
  .description('Begin using a template <template>')
  .option('-C, --chdir <path>', 'Change working directory')
  .option('-d, --debug', 'Adds debuging, better source-mapping')
  .option('-s, --version-safe <version>',
    'forces use of specified version, will error out if version doesn\'t match landfill instance version')
  .action(function (templateName) {
    configLandfill(templateName)
  })

program.parse(process.argv)

// if no command given, show help
if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function listTemplates () {
  let options = program.commands[0]
  configLoader().then(ancestry => {
    let allTemplates = []
    for (let rank in ancestry.ancestry) {
      let ancestor = ancestry.ancestry[rank]
      let templates = Object.keys(ancestor.templates).map(template => {
        return merge({ templateName: template, configDir: ancestor.path }, ancestor.templates[template])
      })
      allTemplates = allTemplates.concat(templates)
    }

    console.log('List of usable Landfill templates:\n')
    allTemplates.forEach(template => {
      if (!options.all) {
        console.log('  ', chalk.magenta(template.templateName))
      } else {
        console.log('  ', chalk.magenta(template.templateName), chalk.cyan(template.configDir), chalk.gray(template.template))
      }
    })
    console.log('')
  })
}

function configLandfill (templateName) {
  // check version safe
  let options = program.commands[1]
  if (options.versionSafe &&
    !semver.satisfies(GLOBAL.version, options.versionSafe)) {
    // version safe (won't change versions) instance is wrong version
    let errorString =
      chalk.red(dedent `
      Expected landfill instance to be version ${options.versionSafe}.
      (module found in ${GLOBAL.__dirname})
      Actual version loaded ${GLOBAL.version}
      Check package.json config, reinstall landfill`)
    console.log(errorString)
    process.exit(1)
  }
  // check debug flag
  if (options.debug) debugMode()

  // Begin loading config for landfill
  configLoader().then(ancestry => {
    let matchConfig = matchTemplateAndVersion(templateName, ancestry)

    if (continueWithCorrectVersion(matchConfig)) {
      // Using correct version of landfill for template
      let cwd = path.resolve(process.cwd())

      if (options.chdir) {
        cwd = path.resolve(cwd, options.chdir)
        if (GLOBAL.debug) console.log(`Changed cwd to ${cwd}`)
      }

      const landfillConfig =
        { templateName: templateName
        , templateConfig: matchConfig.template
        , version: GLOBAL.version
        , configDir: matchConfig.configDir
        , cwd: cwd
        }

      console.log(landfillConfig)
      landfill(landfillConfig)
    }
  })
}

function debugMode () {
  console.log('debug mode')
  GLOBAL.debug = true
  // source map for stack traces
  GLOBAL.require('source-map-support').install()
  // use this to ensure any errors that are swallowed by promises
  // are thrown
  process.on('unhandledRejection', function (error) {
    throw error
  })
}
