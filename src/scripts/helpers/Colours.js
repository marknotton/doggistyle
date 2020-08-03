////////////////////////////////////////////////////////////////////////////////
// Colours 
////////////////////////////////////////////////////////////////////////////////
// A collection of methods for dealing with colours
// TODO: Add HSL and HSLA Support

class Colours {

  static type (value) {
    let result = false
    for (let type of ['isHex', 'isRgb', 'isRgba', 'isHsl', 'isHsla']) {
      if ( Colours[type](value) ) {
        result = type.replace('is', '').toLocaleLowerCase()
        break;
      }
    }
    return result
  }

  // ===========================================================================
  // Checkers 
  // ===========================================================================
  // @see https://stackoverflow.com/questions/32673760/how-can-i-know-if-a-given-string-is-hex-rgb-rgba-or-hsl-color-using-javascript/32685393

  static isValid(value) {
    let result = /^(?:#(?:[A-Fa-f0-9]{3}){1,2}|(?:rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}|hsl[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*|(?:rgba[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*,){3}|hsla[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*,)\s*0*(?:\.\d+|1(?:\.0*)?)\s*)[)])$/i.test(value)
    if (!result) {
      for (let type of ['isHex', 'isRgb', 'isRgba', 'isHsl', 'isHsla']) {
        if ( Colours[type](value) ) {
          result = true
          break;
        }
      }
    }
    return result
  }

  static isHex(value) {
    return /^#(?:[A-Fa-f0-9]{3}){1,2}$/i.test(value)
  }

  static isRgb(value, g, b) {
    if ( value instanceof Object ) {
      if ( value.length == 3  ) {
        value = `rgb(${value.join(', ')})`
      }
    } else if ( typeof value == 'number' && typeof g == 'number' && typeof b == 'number' ) {
      value = `rgb(${value}, ${g}, ${b})`
    } 
    return /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/i.test(value)
  }

  static isRgba(value, g, b, a) {
    if ( value instanceof Object && value.length > 3) {
      if ( typeof a == 'undefined' ) {
        value = `rgba(${value.join(', ')})`
      } else {
        value = `rgba(${value.join(', ')}, 1)`
      }
    } else if ( typeof value == 'number' && typeof g == 'number' && typeof b == 'number' ) {
      if ( typeof a == 'undefined' ) {
        value = `rgba(${value}, ${g}, ${b})`
      } else {
        value = `rgba(${value}, ${g}, ${b}, 1)`
      }
    } 
    return /^^rgba[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*,){3}\s*0*(?:\.\d+|1(?:\.0*)?)\s*[)]$/i.test(value)
  }

  static isHsl(value) {
    return /^hsl[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*[)]$/i.test(value)
  }

  static isHsla(value) {
    return /^hsla[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*,\s*0*(?:\.\d+|1(?:\.0*)?)\s*[)]$/i.test(value)
  }

  // ===========================================================================
  // Casters 
  // ===========================================================================

  /** Color to RGB =============================================================
   * @see https://www.npmjs.com/package/color-rgba
   * @param {String} value 
   * @return {String} 'rgb(255,25,2)'
   */
  static toRgb(value) {
    let type = Colours.type(value)
    if ( type ) {
      const rgba = require('color-rgba')
      return rgba(value)
    }
  }
  
  /** Color to HEX =============================================================
   * @todo Support HSL and HSLA formats too
   * @param {String|Array} This can be passed in as an array of RGB/A values [12, 233, 40] or [12, 233, 40, 0.5]
   *                       You can also pass in a RGB/A string "rgb(255,25,2)" or "rgb(255,25,2 0.5)" 
   * @return {String} "#FFFFFF"
   */
  static toHex(value) {
    let type = Colours.type(value)
    let result = false
    if ( type ) {
      switch(type) {
        
        /** @see https://css-tricks.com/converting-color-spaces-in-javascript/#article-header-id-0 */
        
        case 'rgb':
          if ( value instanceof Object && value.length == 3) {
            let [r, g, b] = value

            r = r.toString(16)
            g = g.toString(16)
            b = b.toString(16)
          
            if (r.length == 1) { r = "0" + r }
            if (g.length == 1) { g = "0" + g }
            if (b.length == 1) { b = "0" + b }
          
            result = r + g + b

          } else if ( typeof value == 'string' ) {

            let sep = value.indexOf(",") > -1 ? "," : " ";

            value = value.substr(4).split(")")[0].split(sep);

            for (let R in value) {
              let r = value[R];
              if (r.indexOf("%") > -1)
              value[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
            }

            let r = (+value[0]).toString(16),
                g = (+value[1]).toString(16),
                b = (+value[2]).toString(16)

            if (r.length == 1) { r = "0" + r }
            if (g.length == 1) { g = "0" + g }
            if (b.length == 1) { b = "0" + b }

            result = r + g + b
          }
        break;
        case 'rgba':
          if ( value instanceof Object && value.length > 3) {
            
            let [r, g, b, a = 1] = value

            r = r.toString(16);
            g = g.toString(16);
            b = b.toString(16);
            a = Math.round(a * 255).toString(16);
          
            if (r.length == 1)
              r = "0" + r;
            if (g.length == 1)
              g = "0" + g;
            if (b.length == 1)
              b = "0" + b;
            if (a.length == 1)
              a = "0" + a;
          
            result = r + g + b + a;

          } else if ( typeof value == 'string' ) {

            let sep = value.indexOf(",") > -1 ? "," : " ";
            value = value.substr(5).split(")")[0].split(sep);
                          
            // Strip the slash if using space-separated syntax
            if (value.indexOf("/") > -1)
              value.splice(3,1);
          
            for (let R in value) {
              let r = value[R];
              if (r.indexOf("%") > -1) {
                let p = r.substr(0,r.length - 1) / 100;
          
                if (R < 3) {
                  value[R] = Math.round(p * 255);
                } else {
                  value[R] = p;
                }
              }
            }

            let r = (+value[0]).toString(16),

            g = (+value[1]).toString(16),
            b = (+value[2]).toString(16),
            a = Math.round(+value[3] * 255).toString(16);
      
            if (r.length == 1) { r = "0" + r }
            if (g.length == 1) { g = "0" + g }
            if (b.length == 1) { b = "0" + b }
            if (a.length == 1) { a = "0" + a }

            result = r + g + b + a;

          }
        break;
        // case 'hsl':
        //   if ( value instanceof Object && value.length == 3) {
        //     let [h, s, l] = value
        //   } else if ( typeof value == 'string' ) {
            
        //   }
        //   result = value
        // break;
        // case 'hsla':
        //   if ( value instanceof Object && value.length > 3) {
        //     let [h, s, l, a = 1] = value
        //   } else if ( typeof value == 'string' ) {
            
        //   }
        //   result = value
        // break;
      }
      return '#' + result
    }
  }

}

module.exports = Colours