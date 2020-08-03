////////////////////////////////////////////////////////////////////////////////
// Doggistyle 
////////////////////////////////////////////////////////////////////////////////

let sass
let options

let Helpers = require('./Helpers')

class Doggistyle {

  /** Global Settings ==========================================================
   * The sass compiler instance must always be the same. 
   * Setting the sass and options globally means we can write
   * methods natively as-per Dart-Sass's API documentation. 
   */

  static get sass() { return sass  }
  static set sass(compiler) { sass = compiler }
  
  static get options() { return options  }
  static set options(opts) { options = opts }

  /** Value Types ==============================================================
   * Value types supported by Sass natively
   * @note arglists are a special list element.
   * @see https://sass-lang.com/documentation/js-api#value-types
   * @example Doggistyle.valueTypes
   * @return {Array}
   */

  static get valueTypes() {
    return [
      'boolean',
      'color',
      'list',
      'map',
      'null',
      'number',
      'string'
    ]
  }

  /** Get Type =================================================================
   * Determine what value type a given Sass object belongs to
   * @param {Sass} [value] 
   * @return {String}
   */

  static getType(value) {

    let type = undefined;

    // Helpers.isSassObject(value)

    for (let item of Doggistyle.valueTypes) {

      let className = item.charAt(0).toUpperCase() + item.slice(1)
      
      if ( item !== null && value instanceof sass.types[className] ) {
        type = item
        break;
      }
    }

    if ( type == 'list' && value instanceof Object) {
      // Special checks for the arglist type as there isn't a native type checker
      if ( 'dartValue' in value && Object.keys(value.dartValue).includes('_argument_list$_keywords') ) {
        type = 'arglist'
      } 
    }

    return type
  
  }

  /** Get Values =============================================================
   * Return the values of a Sass object in a tangeable Javascript data set
   * @param {Sass} [value ]
   */
  static getValue(data) {

    let result = null

    let type = Doggistyle.getType(data)

    if ( type !== null ) {
      switch (type) {

        case 'number' :
          if ( data.getUnit() ) {
            result = data.getValue() + data.getUnit()
          } else {
            result = parseInt(data.getValue(), 10)
          }
        break;
        case 'color' :
        case 'colour' :
          result = [data.getR(), data.getG(), data.getB(), data.getA()]
        break;
        case 'arglist' :
        case 'list' :
          result = []
          for (let index = 0; index < data.getLength(); index++) {
            let value = data.getValue(index)
            result.push(Doggistyle.getValue(value))
          }
        break;
        case 'map' :
          result = {}
          for (let index = 0; index < data.getLength(); index++) {
            // let key = Helpers.string.toKebab(data.getValue(index))
            let key = data.getKey(index)
            let value = data.getValue(index)
            result[key] = Doggistyle.getValue(value)
          }
          // console.log(result)
        break;
        default : 
          result = data.getValue()
        break;

      }
    }

    return result

  }

  /** Type Checler =============================================================
   * Checks if a given type is a supported Sass object 
   * @example Doggistyle.is.color(...)
   * @return {Boolean}
   */

  static get is() { 
    return new Proxy(this, {
      get: function get(target, name) {
        name = name == 'colour' ? 'color' : name
        if ( Doggistyle.valueTypes.includes(name) || name == 'arglist' ) {
          return function wrapper(value) {
            if ( value && value.hasOwnProperty('dartValue') ) {
              return Doggistyle.getType(value) == name
            } 
            return false
          }
        }
      }
    })
  }

  /** Create a Sass Ojbact =====================================================
   * Cast Javascript values to their closest associable type to a Sass mobule
   * {String} casts to sass.type.String(...); this excludes numbers with units and colours. 
   * {Array} casts to sass.type.List(...); this excludes Arrays that match rgb and rgba properties. 
   * {Object} casts to sass.type.Map(...)
   * {Boolean} cast to sass.type.boolean.TRUE or sass.type.boolean.FALSE
   * {Null} casts to sass.type.NULL.NULL
   * {Number} casts to sas.type.Number(...)
   * 
   * @param {Sass}
   */
  
  static create(value) {

    let result = sass.types.Null.NULL

    if ( value === null ) { return result }

    let type = typeof(value)

    // Chnage type under special circomstancse

    if ( type == 'string' && Helpers.number.hasUnit(value) ) {
      type = 'number'
    } else if ( Helpers.colour.isValid(value)) {
      type = 'colour'
    } else if ( Object.prototype.toString.call(value) == '[object Array]' ) {
      type = 'array'
    }

    switch (type) {
      case 'number' :
        result = new sass.types.Number(parseInt(value, 10), Helpers.number.hasUnit(value) || '')
      break;
      case 'string' :
        result = new sass.types.String(value);
      break;
      case 'colour' : 
        result = new sass.types.Color(...Helpers.colour.toRgb(value))
      break;
      case 'boolean' : 
        result = value ? sass.types.Boolean.TRUE : sass.types.Boolean.FALSE
      break;
      case 'array' : 
        let list = new sass.types.List(value.length)
        for (const [index, item] of value.entries()) {
          list.setValue(index, Doggistyle.create(item));
        }
        result = list  
      break;
      case 'object' : 
        let map = new sass.types.Map(Object.values(value).length)
        let index = 0

        for (const [key, item] of Object.entries(value)) {
          map.setKey(index, new sass.types.String(key));
          map.setValue(index, Doggistyle.create(item));
          index ++
        } 

        result = map
      break;
    }

    return result
  }

  /**
   * Update Sass Values ========================================================
   * @param {Sass}   Sass Data Object 
   * @param {Object} Object containing keys realtive to the value you want to 
   *                 amend. The values can be fixed values, or a function. 
   *                 If you define a function, the original values are passed through. 
   *                 This varies depending on the type of sass object that's been passed. 
   *                 Values will amend the referenced object, it does not clone them. 
   * @return {Sass}  The same sass object that was passed in is referenced back.                 
   * 
   * @example Editing colour values with fixed callbacks. 
    Doggistyle.update(colour, {
      value : '#282C34',
      alpha : 0.2,
    }) 
   * @example Editing colour passedthoughed values. 
    Doggistyle.update(colour, {
      value : (r, g, b, a) => {
        return [255, 255, 255, 0.5]
      }
      alpha : 0.2,
    }) 
   * @example Add unit to a number
    Doggistyle.update(number, { unit : 'px' }) 
    * @example Manage arglists
    Doggistyle.update(args, {
      someNumber : { unit : 'px' },
      someMap : { theme : 'red', font : 'Arial }
    }) 
   */

  static update(data, callbacks) {

    if (!callbacks) { return data }

    let type = Doggistyle.getType(data)

    // Helpers.isSassObject(data)

    if ( type ) {

      switch (type) {

        /** Colour -------------------------------------------------------------
         * @param {Callbacks} {
         *    @param {Sting|Array} [value] passes through RGBA as seperate parameters. 
         *                                 Accepts Hex strings or RGBA Arrays to be returned
         *    @param {Number}  [r|R] passes through the red value. Defaults to 0. Must be between 0 and 255
         *    @param {Number}  [g|G] passes through the green value. Defaults to 0. Must be between 0 and 255
         *    @param {Number}  [b|B] passes through the blue value. Defaults to 255. Must be between 0 and 255
         *    @param {Number}  [a|A] passes through the alpha value. Defaults to 1. Must be between 0 and 1
         *    @param {Boolean} [hex] Fixed valaue only. If true, an Hexstring is returned instead of RGBA.
         * } 
         * @todo Handle 8-bit hex code strings such as 0xff6b717f or 0x00000000. There ma
         */

        case 'color' :
        case 'colour' :
          for (let [key, callback] of Object.entries(callbacks)) {
            switch (key) {
              case 'value' :
                if ( typeof callback === "function" ) {
                  callback = callback(data.getR(), data.getG(), data.getB(), data.getA())
                }
                
                if ( Helpers.colour.isHex(callback) ) {
                  callback = Helpers.colour.toRgb(callback)
                }

                callback = callback instanceof Object ? Object.values(callback) : callback

                if ( callback instanceof Array ) {
                  var [r = 0, g = 0, b = 255, a = 1] = callback
                  data.setR(r)
                  data.setG(g)
                  data.setB(b)
                  data.setA(a)
                }

              break;
              case 'r' : 
              case 'R' : 
                if ( typeof callback === "function" ) {
                  callback = callback(data.getR())
                }
                data.setR(callback)
              break;
              case 'g' : 
              case 'G' : 
                if ( typeof callback === "function" ) {
                  callback = callback(data.getG())
                }
                data.setG(callback)
              break;
              case 'b' : 
              case 'B' : 
                if ( typeof callback === "function" ) {
                  callback = callback(data.getB())
                }
                data.setB(callback)
              break;
              case 'a' : 
              case 'alpha' : 
                if ( typeof callback === "function" ) {
                  callback = callback(data.getA())
                }
                data.setA(callback)
              break;
              
            }
          }
        break;

        /** Number -------------------------------------------------------------
         * @param {Callbacks} {
         *   @param {Number} [value] passes through the origial value,
         *   @param {Number} [unit]  passes through the original unit if any 
         * } 
         */

        case 'number' :
          for (let [key, callback] of Object.entries(callbacks)) {
            switch (key) {
              case 'value' :
                if ( typeof callback === "function" ) {
                  data.setValue(callback(data.getValue()))
                } else {
                  data.setValue(callback)
                }
              break;
              case 'unit' : 
                if ( typeof callback === "function" ) {
                  data.setUnit(callback(data.getUnit()))
                } else {
                  data.setUnit(callback)
                }
              break;
            }
          }
        break;

        /** String -------------------------------------------------------------
         * @param {Callbacks} {
         *   @param {String} [value] passes through the origial value,
         * } 
         */

        case 'string' :
          for (let [key, callback] of Object.entries(callbacks)) {
            switch (key) {
              case 'value' :
                if ( typeof callback === "function" ) {
                  callback = callback(data.getValue())
                }
                data.setValue(callback)
              break;  
            }
          }
        break;

        /** List -------------------------------------------------------------
         * @param {Callbacks} {
         *   @param {Array} [value] passes through the origial value,
         * } 
         */

        case 'list' :
          for (let [key, callback] of Object.entries(callbacks)) {
            switch (key) {
              case 'value' :
                if ( typeof callback === "function" ) {
                  let values = []
                  for (let index = 0; index < data.getLength(); index++) {
                    let value = data.getValue(index)
                    values.push(Doggistyle.getValue(value))
                  }

                  callback = callback.apply(this, values)
                }

                if ( callback.length > data.getLength()) {
                  Helpers.error('The amount of items passed back into the  array exceeds the amount of given values.')
                }

                for (let index = 0; index < data.getLength(); index++) {
                  let value = callback[index]
                  if ( value ) {
                    data.setValue(index, Doggistyle.create(value));
                  }
                }
              break;  
            }
          }
        break;

        /** Map -------------------------------------------------------------
         * @param {Callbacks} {
         *   @param {Array} [value] passes through the origial value,
         * } 
         */

        case 'map' :
          for (let [key, callback] of Object.entries(callbacks)) {
            switch (key) {
              case 'value' :
                if ( typeof callback === "function" ) {

                  let values = {}
                  for (let index = 0; index < data.getLength(); index++) {
                    let value = data.getValue(index)
                    console.log(data.getKey(index))
                    values[data.getKey(index)] = (Doggistyle.getValue(value))
                  }

                  console.log(values)

                //   callback = callback.apply(this, values)
                }

                // if ( callback.length > data.getLength()) {
                //   Helpers.error('The amount of items passed back into the  array exceeds the amount of given values.')
                // }

                // for (let index = 0; index < data.getLength(); index++) {
                //   let value = callback[index]
                //   if ( value ) {
                //     data.setValue(index, Doggistyle.create(value));
                //   }
                // }
              break;  
            }
          }
        break;

        /** Boolean -------------------------------------------------------------
         * @param {Callbacks} {
         *   @param {Boolean} [value] passes through the origial value,
         * } 
         */

        case 'boolean' :
          for (let [key, callback] of Object.entries(callbacks)) {
            switch (key) {
              case 'value' :
                if ( typeof callback === "function" ) {
                  callback = callback(data.getValue())
                }
                data.value = callback
              break;  
            }
          }
        break;

        /** Arglist -------------------------------------------------------------
         * @param {Callbacks} {
         *   @param {Arglist} [value] 
         * } 
         */

        case 'arglist' :
          // let values = data.dartValue._list1$_contents
          // let length = data.getLength()
          // data = []
          // console.log(length)

         
          for (let index = 0; index < data.getLength(); index++) {
            let callback = Object.values(callbacks)[index];
            if ( typeof callback !== 'undefined' ) {
              if ( typeof callback == 'function' ) {
                data.setValue(index, 
                  Doggistyle.update(data.getValue(index), 
                  { value : callback.apply(this, Doggistyle.getValue(data.getValue(index))) }
                ));
              } else if ( callback instanceof Object) {
                data.setValue(index, Doggistyle.update(data.getValue(index), callback));
              } else {
                data.setValue(index, Doggistyle.update(data.getValue(index), { value : callback}));
              }
            }
          }

          // for (const [index, item] of values.entries()) {
          //   let value = data.getValue(index)
          //   Doggistyle.update(item, {
          //     value : 'dfg'
          //   })
          //   // console.log(item)
          //   data.setValue(index, new sass.types.String('DFGDFGDFGDFG'));
          // }

          // for (var member in data) delete data[member];


          // Object.entries(callbacks).forEach(([name, callback], index) => {
            
          //   let value = values[index]

          //   console.log('Name:', name)
          //   console.log('Callback:', callback)
          //   console.log('Value:', value)

          //   // When checking values from arglists or lists, we have to determine the 
          //   // type using a more verbose method
          //   if ( Object.keys(value).includes('_color1$_red') ) {
          //     console.log('color')
          //   } else if ( Object.keys(value).includes('_list1$_contents') ) {
          //     console.log('list')
          //   } else if ( Object.keys(value).includes('contents') ) {
          //     console.log('map')
          //   } else if ( Object.keys(value).includes('numeratorUnits') ) {
          //     console.log('number')
          //   } else if ( Object.keys(value).includes('_string$_sassLength') ) {
          //     console.log('string', value.text)
          //     // data.push(Doggistyle.create(value.text))

          //   }

          //   // let test = Doggistyle.create(values[index].text)
          //   // console.log(test, value)
          //   // Doggistyle.update(test, value)
          // })
          // for (let [property, callback] of Object.entries(callbacks)) {
            // console.log(property)            
          // }
        break;
      }
    } else {
      // Helpers.error('Data type not supported')
    }
    return data
  }


  static getArglist(arglist) {
    return Doggistyle.getValue(arglist[0])
  }

}

module.exports = Doggistyle