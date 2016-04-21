import readline from 'readline'
import chalk from 'chalk'

/**
 * Utilities
 */

function questionPromise (i, msg) {
  return new Promise((resolve, reject) => {
    i.question(msg, answer => {
      resolve(answer)
    })
  })
}

function formatQuestion (msg, def) {
  let questionString = chalk.green('? ') + chalk.bold(msg.trim()) + ' '
  if (def) questionString += chalk.gray('(\'' + def + '\'): ')
  return questionString
}

/**
 * Node terminal prompt utility using latest technologies
 */

export class Prompter {
  constructor () {
    this.promises = Promise.resolve()
    this.answers = {}
  }

  /**
   * Init class, and begin readline interface
   */
  init () {
    this.rl = readline.createInterface(process.stdin, process.stdout)
    return this
  }

  /**
   * Formats and display's messages and prompts users for a single line response.
   * @param  {String} key   - key answer is assigned to in answers object
   * @param  {String} msg   - msg that the terminal will prompt user with
   * @param  {String} [def] - [description]
   * @return {Prompter}     - instance of self to allow chaining
   */
  prompt (key, msg, def) {
    this.promises = this.promises.then(() => {
      let questionString = formatQuestion(msg, def)
      return questionPromise(this.rl, questionString)
    })
    .then(answer => {
      if (answer === '' && def) answer = def
      this.answers[key] = answer
      return { answer: answer, key: key }
    })
    return this
  }

  promptArray (prompts) {
    for (let promptIndex in prompts) {
      let prompt = prompts[promptIndex]
      let key = prompt.key
      let msg = prompt.message
      let def = prompt.default
      this.prompt(key, msg, def)
    }
    return this.getAnswers()
  }

  wait () {
    return this.promises
  }

  getAnswers () {
    return this.promises.then(() => {
      this.close()
      return this.answers
    })
  }

  close () {
    this.rl.close()
  }
}
