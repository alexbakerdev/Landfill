import path from 'path'

import { Prompter } from './lib/prompt'
import { applyTemplate } from './lib/fileCopy.js'
import chalk from 'chalk'
import dedent from 'dedent-js'

export default function landfill (templateName, templatePath, template, cwd) {
  let prompt = new Prompter()

  // Begin templating
  prompt.init()
  // ask prompts
  prompt
    .promptArray(template.prompts)
    .then(answers => {
      // Get computed props and combine with answers
      let props = handleComps(answers, template.comps)
      // Handle each entry
      return handleEntries(props, template.entry)
    }).catch((err) => {
      // catch errors
      throw err
    })

  function handleComps (answers, comps) {
    // computed props
    let props = answers
    if (comps) {
      for (let prop in comps) {
        props[prop] = comps[prop](props, cwd)
      }
    }
    return props
  }

  /**
   * Resolve all template entry properties
   * Return a promise
   * @param  {Object} props   - props to template with
   * @param  {Object} entries - dictionary of entries from template config
   * @return {Promise}        - a promise that resolves when all files
   *                            copied to their new location
   */
  function handleEntries (props, entries) {
    return Promise.all(
      Object.keys(entries).map((entry) => {
        let entryConfig = entries[entry]

        // resolve entry config
        let includeTemplate = entryConfig.template || /(js|html)$/
        let encoding = entryConfig.encoding || 'utf8'
        let skip = entryConfig.skip || false

        // validate includeTemplate
        if (!(includeTemplate instanceof RegExp || typeof includeTemplate === 'string')) {
          throw new Error(dedent `
            entry.template must be a string or an instance of RegExp.
            Entry ${entry}
            Template ${templateName}
          `)
        }

        // validate skip
        if (!(typeof skip === 'function' || skip instanceof RegExp || skip === false)) {
          throw new Error(dedent `
            entry.skip must be a function, an instance of a RegExp, or false.
            Entry ${entry}
            Template ${templateName}
          `)
        }

        // Get destination for entry
        let destination

        if (typeof entryConfig.destination === 'function') {
          entryConfig.destination = entryConfig.destination(props, cwd)
        }
        if (typeof entryConfig.destination === 'string') {
          destination = entryConfig.destination
        } else {
          throw new Error(dedent `
            entry.destination must be a string or a function that returns a string.
            Entry ${entry}
            Template ${templateName}
          `)
        }

        // calculate source folder for entry
        let source = path.resolve(templatePath, entry)

        // Config Templating
        let opts =
          { props: props
          , template: includeTemplate
          , skip: skip
          , encoding: encoding
          }

        // Apply Template
        return applyTemplate(source, destination, opts)
          .then(() => {
            console.log(`Template ${chalk.cyan(templateName + '/' + entry)}, templated to ${chalk.magenta(path.relative(cwd, destination))}`)
          }).then(() => {
            // completed entry hook
            if (entryConfig.completed && typeof entryConfig.completed === 'function') {
              entryConfig.completed(props, cwd, destination)
            }
          })
      })
    )
  }
}

