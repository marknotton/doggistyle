////////////////////////////////////////////////////////////////////////////////
// Doggistyle
////////////////////////////////////////////////////////////////////////////////

// =============================================================================
// Settings
// =============================================================================

/**
 * @example Native Method
 * How sass is compiled without Doggistyle
 * let sass = require('gulp-dart-sass')
 * 
 * return gulp.src(<source>)
 * 	.pipe(sass({...}))
 * 	.pipe(gulp.dest(<dest>))
 * 
 * @example New Method
 * Doggistyle is a wrapper for 'gulp-dart-sass'; pass in the same arguments as normal.
 * We use the 'stream' method so that the gulp pipe task works as expected.
 * 
 * return gulp.src(<source>)
 * 	.pipe(doggistyle.stream({...}))
 * 	.pipe(gulp.dest(<dest>))
 * 
 * @example Mixed Method
 * This method allows you to pass in your own custom sass compiler. 
 * You must pass in the gulp-dart-sass's compiler as the sass instance must be consistent.
 * This method only returns an 'options' object that is valid for 'gulp dart sass'.
 * 
 * let sass = require('gulp-dart-sass')
 * 
 * return gulp.src(<source>)
 * 	.pipe(gulp.dest(<dest>))
 *  .pipe(sass(doggistyle({
 *    compiler : sass.compiler,
 *    ...
 *    })
 *  ))
 * .pipe(gulp.dest(<dest>))
 */

'use strict'

let Helpers = require('./src/scripts/Helpers')

const doggistyle = (options = {}, sync) => {

	Helpers.log('Doggistyle')

	// Add default settings	but allow them to be replaced by the options passed in
	options = Helpers.merge({
		alias    : 'ds',
		mode     : 'implicit',
		devmode  : false,
		sync     : sync,
	}, options)

	// If a compiler was passed in, overwrite the global instance
	if ( 'compiler' in options ) {
		if ( options.compiler !== false ) {
			doggistyle.compiler = options.compiler
		} 
		delete options['compiler'] 
	}

	doggistyle.functions = require('./src/scripts/Functions')(options, doggistyle.compiler)
	// doggistyle.importers = require('./src/scripts/Importers')(options, doggistyle.compiler)

	options = Helpers.merge(options, {
		functions : doggistyle.functions,
		// importer : doggistyle.importers
	})

	// Shallow clone and disconnect the references for the options object so we can
	// filter out stuff that is bespoke to Doggistyle. We don't need unsupported 
	// properties to be sent to gulp-dart-sass or sass.

	options = {...options}

	Object.values(['alias', 'mode', 'sync', 'devmode', 'variables']).forEach(setting => {
		if ( setting in options ) {
			delete options[setting] 
		} 
	})
	
	return options
}

// This is for Gulp pipeline support, allowing us to simply wrap the Gulp Dart Sass module
doggistyle.stream = (options, sync) => {

	const gulpDartSass = require('gulp-dart-sass')

	doggistyle.compiler = gulpDartSass.compiler

	return gulpDartSass.call(this, doggistyle(options, sync), sync)
}

doggistyle.compiler = require('sass')


// 	get manage() {
// 		return {
// 			list : (args, callbacks) => {
	
// 				if ( args.length ) {
		
// 					args.forEach(setting => {
		
// 						let type = getType(setting)
		
// 						// Check if the object is acctualy a simple Array
// 						type = setting instanceof Array ? 'array' : type
		
// 						// If an argument type doesn't match a method type. Throw a warning
// 						// with instructions on how handle the argument correctly.
// 						if (!Object.keys(callbacks).includes(type)) {
// 							// if ( type !== undefined) {
// 							//   throw `Instantiated with a ${type} argument that hasn't been handled 
// 							//   correctly in the manage method. Add the following to the manage function:
// 							//   manage.list(args, { ${type} : (value) => {...} })`
// 							// } else {
// 							//   throw `type was undefined`
// 							// }
		
// 						} else {
		
// 							callbacks[type](setting)
		
// 						}
// 					})
// 				}
// 			}
// 		}
// 	}

// 	getFunctions() {

// 		return {
// 			'defaults($args)': function(args, done) {
// 				done(new sass.types.Number(123));
// 			}
// 		}

// 		let results = {
// 			'defaults($args)': function(args, done) {
	
// 				if ( is.arglist(args) ) {
	
// 					let arglist = get.arglist(args)
	
// 					// console.log(arglist.length)
// 					// console.log(arglist)
	
// 					manage.list(arglist, {
// 						boolean : (value) => { 
// 							console.log('Boolean: ', value.getValue())
// 						},
// 						color : (value) => { 
// 							colour = new sass.compiler.types.Color(value._color1$_red, value._color1$_green, value._color1$_blue, value.alpha);
// 							console.log('Colour: ', rgbToHex(colour.getR(), colour.getG(), colour.getB()))
// 						},
// 						list : (value) => { 
// 							console.log('List: ', value)
// 						},
// 						map : (value) => { 
	
// 							let items = Object.values(value.contents._map._rest);
// 							let map = new sass.compiler.types.Map(items.length)
	
// 							let index = 0
	
// 							for (let item of items) {
// 								map.setKey(index, new sass.compiler.types.String(item[0].hashMapCellValue.text || item[0].hashMapCellValue.value));
// 								map.setValue(index, new sass.compiler.types.String(item[0].hashMapCellKey.text));
// 								index ++
// 							}
	
// 							console.log('Map: ', map)
// 						},
// 						null : (value) => { 
// 							console.log('Null')
// 						},
// 						number : (value) => { 
// 							let unit = value.numeratorUnits[0]
// 							let number = new sass.compiler.types.Number(value.value, unit);
// 							console.log('Number: ', number.getValue())
// 						},
// 						string : (value) => { 
// 							let string = new sass.compiler.types.String(value.text);
// 							console.log('String: ', string.getValue())
// 						}
// 					})
	
// 				} 
	
// 				// if ((args instanceof sass.compiler.types.Number)) {
// 				//   console.log('ARGLIST')
// 				// } 
// 				// let newColour = new sass.compiler.types.Color(colour.getR(), colour.getG(), colour.getB(), colour.getA());
	
// 				// let settings = {
// 				//   size : size.getValue(),
// 				//   colour : colour
// 				// }
	
// 				// if (!(colour instanceof sass.types.Color)) {
	
// 				// }
	
// 				// console.dir(args )
	
// 				// let map = objectToMap(settings)
	
	
// 				// console.log(JSON.stringify(args.dartValue, null, 4));
	
// 				done(new sass.types.Number(args.getValue()));
// 			}
// 		}
	
// 		return results;
// 	}
	
	


// 	rgbToHex(r, g, b) {
// 		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
// 	}
	

// 	objectToMap(data) {

// 		let map = new sass.compiler.types.Map(Object.keys(data).length)
// 		let index = 0
	
// 		for (let [key, value] of Object.entries(data)) {
			
// 			map.setKey(index, new sass.compiler.types.String(key));
	
// 			switch(typeof value) {
// 				case "number":
// 					map.setValue(index, new sass.compiler.types.Number(value, "px"));
// 				break;
// 				case "string":
// 					map.setValue(index, new sass.compiler.types.String(value));
// 				break;
// 				default:
// 					map.setValue(index, value);
// 			}
	
// 			index ++
	
// 		}
	
// 		return map
	
// 	}

// }

module.exports = doggistyle