////////////////////
////////////////////
////////////////////

function doggistyle(data) {

  let results = {
    
    includePaths: [
      paths.sass + '/vendor/',
      paths.sass + '/vendor/doggistyle',
      'node_modules/@marknotton/doggistyle/src'
    ],
    functions: getFunctions(),
    importer: [
      (url, prev) => {
        if ( typeof data.variables !== 'undefined'  ) {
          return {
            contents: getVariables(data.variables)
          }
        }
        return null
      }
    ]
  }

  // TODO: Turn this into a deepmerge so that functions and includePaths and other
  // properties are extended and not overwritten
  results = Object.assign(results, data)

  return results

}

// const functions = [
//   {
//     name : 'defaults',
//     arguments : {'size':100, 'colour':'red'},
//     method : (size, colour, callback) => {
//       callback(new sass.compiler.types.Number(size))
//     }
//   }
// ]


function getType(value) {
  
  let types = ['Boolean', 'Color', 'List', 'Map', 'Null', 'Number', 'String']
  
  // Special checks for the arglist type as there isn't a native type checker
  if ( 'dartValue' in value && Object.keys(value.dartValue).includes('_argument_list$_keywords') ) {
    return 'arglist'
  } 

  // Check for instances of each type until there is a match. 
  // These won't work for arglist or list items 
  for (let type of types) { 
    if ( value instanceof sass.compiler.types[type] ) {
      return type.toLowerCase()
    }
  }

  // When checking values from arglists or lists, we have to determine the 
  // type using a more verbose method
  if ( Object.keys(value).includes('_color1$_red') ) {
    return 'color'
  } else if ( Object.keys(value).includes('_list1$_contents') ) {
    return 'list'
  } else if ( Object.keys(value).includes('contents') ) {
    return 'map'
  } else if ( Object.keys(value).includes('numeratorUnits') ) {
    return 'number'
  } else if ( Object.keys(value).includes('_string$_sassLength') ) {
    return 'string'
  }

}

const is = {
  arglist : (value) => getType(value) == 'arglist',
  boolean : (value) => getType(value) == 'boolean',
  colour  : (value) => getType(value) == 'color',
  color   : (value) => getType(value) == 'color',
  list    : (value) => getType(value) == 'list',
  map     : (value) => getType(value) == 'map',
  null    : (value) => getType(value) == 'null',
  number  : (value) => getType(value) == 'number',
  string  : (value) => getType(value) == 'string'
}

const get = {
  arglist : (value) => {
    if ( !is.arglist(value) ) {
      throw "Expected an arglist.";
    }

    let args = Object.values(value.dartValue._list1$_contents).filter(item => {
      return typeof item == 'object' && typeof item !== 'undefined' && !Array.isArray(item)
    }) 

    // args = args[1]

  
    // console.log(args);

  //  args[0] = new sass.compiler.types.Number(args[0])

    return args;
    
  }
}

  /**
    * Manage arguments by their type and trigger a function for each argument type
    *
    * @exmaple
    this.manage(arguments, {
      boolean  : (setting) => { console.log('boolean', setting) },
      function : (setting) => { console.log('function', setting) },
      number   : (setting) => { console.log('number', setting) },
      element  : (setting) => { console.log('element', setting) },
      string   : (setting) => { console.log('string', setting) },
      object   : (setting) => { this.settings = this.merge(this.settings, setting) },
    })
    *
    * @param  {Object} args Directly pass through the functions arguments.
    *
    * @param  {Object} callbacks A collection of methods to call depending on the argument
    *                            type. Dom elements (including jQueryified elements) are
    *                            the only special case that callbacks 'element'.
  */

const 

}

function 