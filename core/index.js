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

let Helpers = require('./src/Helpers')

const doggistyle = (options = {}, sync) => {

	// Helpers.log('Doggistyle')

	// Add default settings	but allow them to be replaced by the options passed in
	
	options = Helpers.merge({
		alias    : 'ds',
		mode     : 'implicit',
		devmode  : false,
		sync     : sync,
		includePaths : []
	}, options)

	// If a compiler was passed in, overwrite the global instance
	
	if ( 'compiler' in options ) {
		if ( options.compiler !== false ) {
			doggistyle.compiler = options.compiler
		} 
		delete options['compiler'] 
	}

	// Because the Helpers.merge method (using lodash)does) doesn't recursively  merge
	// nested arrays correctly. The keys are overwritten. So I have to define a set of
	// default values to the includePaths like this 

	options.includePaths = options.includePaths.concat([
		process.env.PWD + '/node_modules/@doggistyle/library/src',
		process.env.PWD + '/node_modules/@doggistyle/library/src/collections/',
		process.env.PWD + '/node_modules/@doggistyle/library/src/helpers/',
		process.env.PWD + '/node_modules/@doggistyle/library/src/modules/',
		process.env.PWD + '/node_modules/@doggistyle/library/src/variables/'
	])

	doggistyle.functions = require('./src/Functions')(options, doggistyle.compiler)
	// doggistyle.importers = require('./src/Importers')(options, doggistyle.compiler)

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

module.exports = doggistyle