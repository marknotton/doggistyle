const Helpers = require('./Helpers')

class Importers {

  constructor(options, compiler) {

    Helpers.log('Importers')

    let variables = 'variables' in options ? Helpers.ObjectToSassVariables(options.variables) : false

    let results = [
      (url, prev, done) => {
        if ( variables && (url == 'doggistyle:variables' || url == `${options.alias}:variables` ) ) {
          return {
            contents: variables
          }
        }
        return null
      }
    ]

    return results
  }
}

module.exports = (...args) => { return new Importers(...args) }