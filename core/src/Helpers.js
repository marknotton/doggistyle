////////////////////////////////////////////////////////////////////////////////
// Helpers 
////////////////////////////////////////////////////////////////////////////////
// A collection of methods for dealing with css related, but not sass specific tasks. 

class Helpers {

  /**
   * Combine objects with recursion for deep merging
   * @borrows loadash.merge as merge
   */
  static get merge() { return require('lodash.merge') }

  /**
   * Deep object and array cloner
   * @borrows loadash.deepclone as deepclone
   */
  static get deepclone() { return require('lodash.deepclone') }

  /**
   * CLI Logger 
   * @borrows lumberjack as log
   */
  static get log() { return require('@marknotton/lumberjack') }

  /**
   * Error Logger
   * @param {Strong} message - The message you want to output
   */
  static error(message) {
    throw new Error('Doggistyle: ' + message)
  }

  /**
   * Check value is a Sass Object
   * @param {Sass} value
   */
  static isSassObject(value) {
    if ( !value.hasOwnProperty('dartValue') ) {
      Helpers.error(value + ' is not a Sass object')
    }
    return value.hasOwnProperty('dartValue')
  }

  /**
   * CSS Units
   * @returns {Object} Supported css units categorised in there respective, 
   *                   relative, absolute and resolution groups. 'all' is also 
   *                   available which combines unit groups together into a single array.
   */
  static get units() {
    const units = {
      relative   : ['em', 'ex', '%', 'px', 'cm', 'mm', 'in', 'pt', 'pc', 'ch', 'rem', 'vh', 'vw', 'vmin', 'vmax'],
      absolute   : ['cm', 'mm', 'in', 'px', 'pt', 'pc'],
      resolution : ['dpi', 'dpcm', 'dppx']
    }
    return {
      relative : units.relative,
      absolute : units.absolute,
      resolution : units.resolution,
      all : [...units.relative, ...units.absolute, ...units.resolution]
    }
  }

  /** Number Methods ===========================================================
   */
  
  static get number() { 
    return {
      hasUnit : (value) => { 
        return Helpers.units.all.find(suffix => typeof(value) == 'string' && value.endsWith(suffix))
      }
    }
  }

  /** String Methods ===========================================================
   */
  
  static get string() { 
    return {
      toKebab : (value) => { 
        return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2').toLowerCase();
      }
    }
  }

  /** Colour Methods ===========================================================
   * @uses Colours
   * @alias color
   */
  
  static get colour() { return require('./helpers/Colours') }
  static get color()  { return require('./helpers/Colours') }

   /** Get Class Method Names ==================================================
   * Get all the public methods (functions) names from a given class object
   * @example Helpers.getClassMethodNames(class)
   * @see https://stackoverflow.com/a/35033472/843131
   * @return {Array}
   */

  static getClassMethodNames(object) {

    let names = []

    if ( object.prototype ) {
      names = Object.getOwnPropertyNames(object.prototype)
    } else {
      let props = []

      do {
        const l = Object.getOwnPropertyNames(object)
        .concat(Object.getOwnPropertySymbols(object).map(s => s.toString()))
        .sort()
        .filter((p, i, arr) =>
          typeof object[p] === 'function' &&  //only the methods
          p !== 'constructor' &&              //not the constructor
          (i == 0 || p !== arr[i - 1]) &&     //not overriding in this prototype
          props.indexOf(p) === -1             //not overridden in a child
        )
        props = props.concat(l)
      }
      while (
        (object = Object.getPrototypeOf(object)) &&  //walk-up the prototype chain
        Object.getPrototypeOf(object)                //not the Object prototype methods (hasOwnProperty, etc...)
      )
  
      names = props
    }

    if ( names ) {
      // Ommit known methods that we won't include inherited and prive mthods
      return names.filter(name => 
        !['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf' ].includes(name)
        && !~name.indexOf( "_" ) 
        && !~name.indexOf( "__" )
      )
    }

  }

  /** Get Method Parameters ====================================================
   * Get a methods (functions) argument parameters and sanatise the results suitable for Sass
   * @see https://stackoverflow.com/a/9924463/843131
   * @example Helpers.getMethodParameters(function)
   * @return {Object} keys are argument names, values are default values if present
   */

  static getMethodParameters(func) {
    
    // Cast the entire function to a string, clearing any inline comments 
    let string = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
    
    // Extract all data from within the first set of brackets to get the arguments
    let params = string.slice(string.indexOf('(')+1, string.indexOf(')'));
    
    // Split the arguments into an array so we can check for any default values
    let split = params.split(',')

    let results = {}

    // Iterate through each argument
    split.forEach(item => {
      // If an equals symbol exists, we assume there is a default value
      if ( item.includes('=')) {
        // Split the key and the value using the equal symbol as the delimiter
        var [key, value] = item.trim().split('=')
        results[key.trim()] = value.trim().replace("`${", '').replace("}`", '')
      } else {
        // If there is no default value assigned, just set the value to 'undefined'
        results[item.trim()] = undefined
      }
    })
    return results;
  }

  /** Sass Get Functions =======================================================
   * Pass in classes so that we can consolidate all the public methods. 
   * These will then be reformatted to an object suitable for the Sass functions API.
   * @see https://sass-lang.com/documentation/js-api#functions
   * @example Helpers.getSassFunctions(this, Checkers, Maps, Lists)
   */

  static getSassFunctions(...args) {

    let results = {}

    args.forEach(classObject => {

      Helpers.getClassMethodNames(classObject).forEach(name => {    

        // Because there is no scope, we have to declare a new instance of each class
        // unless it was delcared and we can just pass it as-is
        let constructor = classObject.prototype ? new classObject({}, Helpers.sass) : classObject
        
        // Get the function parameters
        let parameters = Helpers.getMethodParameters(constructor[name])

        // Cast the function parameters into a valid string to be used for the key
        let params = Object.keys(parameters).reduce((result, param, index) => {
          // We use the reduce method so that we can skip specific parameters. 
          // For example, there is no use for the 'done' callback so it must be ignored
          // This can be done by skipping the last parameter. 
          // if ( Object.keys(parameters).length !== index + 1 )) {
          if ( Object.keys(parameters).length !== index) {
            let value = parameters[param]
            if ( value ) {
              // If a default value exists, define it and remove any quotes.  
              result.push(`$${param}:${value.replace(/['"]+/g, '')}`);
            } else {
              // Otherwise just set the argument name
              result.push(`$${param || "args..."}`);
            }
          }
          return result
        }, []).join(', ')

        
        // Convert name referenced by sass to kebab-case. 
        let newname = Helpers.string.toKebab(name);
        
        results[`${newname}(${params})`] = function() { 
          return constructor[name].apply(constructor, arguments)
        }
      })
    })

    return results

  }

  /** Object to Sass Variables =================================================
   * Cast an object into scss variables. Objects values are cast to Maps, and
   * Array valyes to Lists. There is a little recurssion going on too; this 
   * is my layman attempt at handling nested values. 
   * @param {Object} variables 
   * @example 
   * Input:
   *  Helpers.ObjectToSassVariables({ theme : 'red', font : 'Arial' })
   * Output:
   *  $theme:red; $font : 'Arial'
   * @return {String}
   */

  static ObjectToSassVariables(variables, seperator=';') {

    if ( !variables || !(variables instanceof Object) ) { return '' }

    let result = []

    for (let [key, value] of Object.entries(variables)) {
      if ( Object.prototype.toString.call(value) == '[object Array]' ) {
        let r = []
        for (let v of value) {
          if ( Object.prototype.toString.call(v) == '[object Object]' ) {
            let t = Helpers.ObjectToSassVariables(v).replace(/;/gi, ',')
            r.push(`(${t.substring(0, t.length-1)})`)
          } else {
            r.push(v)
          }
        }
        result.push(`${key}: (${r.join(', ')});`)
      } else if ( Object.prototype.toString.call(value) == '[object Object]' ) {
        let t = Helpers.ObjectToSassVariables(value).replace(/;/gi, ',')
        result.push(`$${key}: (${t.substring(0, t.length-1)});`)
      } else {
        result.push(`$${key}: ${value}${seperator}`)
      }
    }
    return String(result.join(' '))
  }
}

module.exports = Helpers