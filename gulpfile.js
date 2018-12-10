////////////////////////////////////////////////////////////////////////////////
// Doggistyle Gulpfile
////////////////////////////////////////////////////////////////////////////////

// =============================================================================
// Requirements
// =============================================================================

const gulp     = require('gulp');
const fs       = require('fs');
const plumber  = require('gulp-plumber');
const concat   = require('gulp-concat');
const glob     = require("multi-glob").glob;
const notifier = require('@marknotton/notifier');
const log      = require('@marknotton/lumberjack');
const sassdoc  = require('sassdoc');

// =============================================================================
// Settings
// =============================================================================

notifier.settings({ success : 'icon.png'});
log.settings({cache : false });

// Doggistyle source glob ------------------------------------------------------

const source = [
	'src/_introduction.scss',
  'src/helpers/**/*.scss',
  'src/_settings.scss',
  'src/_properties.scss',
  'src/_placeholders.scss',
  'src/collections/**/*.scss',
	'src/_aliases.scss',
];

// =============================================================================
// Compiler
// =============================================================================

gulp.task('compile', ['imports','aliases'], () => {
  return gulp.src(source)
  .pipe(plumber({errorHandler: notifier.error }))
  .pipe(concat('_doggistyle.scss'))
  .pipe(gulp.dest('dist'))
  .pipe(gulp.dest('../Aspire Courses/Website/vendor/marknotton/doggistyle/dist'))
  // .pipe(gulp.dest('../../Craft Master/Website/vendor/marknotton/doggistyle/dist'))
  .pipe(notifier.success('Compiled Doggistyle successfully'))
});

// Default task is aliased to the 'compile' task -------------------------------

gulp.task('default', ['compile']);

// Watch changes and run the compile task on each new change -------------------

gulp.task('watch', ['compile'], () => {
	gulp.watch(source.filter(el => el !== 'src/_aliases.scss'), ['compile'])
});

// =============================================================================
// Aliases
// =============================================================================
// Inject a selection of mixin and function aliases at the bottom of the output.
// Mixins that have an array value can contain a boolean which added the @content
// attribute within the mixins declaration.

const aliases = {
	'mixins' : {
		'animation'  : ['animate', true],
		'is-chrome'  : ['chrome', true],
		'is-edge'    : ['edge', true],
		'is-firefox' : ['firefox', true],
		'is-ie'      : ['ie', true],
		'is-opera'   : ['opera', true],
		'is-safari'  : ['safari', true],
		'transition-delay' : ['delay', true],
		'breakpoint' : ['break', true],
		'border-radius' : 'radius',
		'gradient-right' : 'gradient-horizontal',
		'gradient-top' : 'gradient-vertical',
		'greyscale' : 'grayscale',
		'dropshadow' : 'drop-shadow',
		'hue' : 'hue-rotate',
		'translateY' : 'y',
		'translateX' : 'x',
		'outside-break' : ['break-out', true],
		'outside-break' : ['break-in', true],
	},
	'functions' : {
		'colour'                     : 'color',
		'to-colour'                  : 'to-color',
		'is-colour'                  : 'to-colour',
		'get-colour-value'           : 'get-color-value',
		'colour-contrast'            : 'color-contrast',
		'get-variable-colour-value'  : 'get-variable-color-value',
		'is-boolean'                 : 'is-bool',
		'random-colour'              : 'random-color',
		'random-colour'              : 'rc',
		'string-replace'             : 'str-replace',
		'remove-unit'                : 'strip-unit',
	}
};

gulp.task('aliases', function () {

	let heading = `//${'/'.repeat(78)}\n// Aliases ${' '.repeat(60)} #aliases\n//${'/'.repeat(78)}\n\n`

	// Mixins --------------------------------------------------------------------

	let mixins = `//${'='.repeat(78)}\n// Mixins Aliases\n//${'='.repeat(78)}\n\n`

	Object.entries(aliases.mixins).forEach(([key, value]) => {

		mixins = mixins + `/// @alias ${key}\n`
		mixins = mixins + `@mixin ${typeof value == 'object' ? value[0] : value}($args...) {\n`
		if (value.includes(true)) {
			mixins = mixins + `\t@include ${key}($args...) { @content; }\n`
		} else {
			mixins = mixins + `\t@include ${key}($args...);\n`
		}
		mixins = mixins + `}\n\n`
	});

	// Fucntions -----------------------------------------------------------------

	let functions = `//${'='.repeat(78)}\n// Functions Aliases\n//${'='.repeat(78)}\n\n`

	Object.entries(aliases.functions).forEach(([key, value]) => {

		functions = functions + `/// @alias ${key}\n`
		functions = functions + `@function ${typeof value == 'object' ? value[0] : value}($args...) {\n`
		functions = functions + `\t@return ${key}($args...);\n`
		functions = functions + `}\n\n`
	});

	// Render File ---------------------------------------------------------------

	fs.writeFile('src/_aliases.scss',(heading + mixins + functions), null, (err) => {
		if (err) throw 'error writing file: ' + err;
		log('Created:', 'src/_aliases.scss', 'Aliases file created successfully');
	});

});

// =============================================================================
// Imports
// =============================================================================
// Using the source glob, create an imports file which lists all files matched
// by the glob and format them into a single import.
// This gets rendered into the distrubtion file so users have the option to
// include everything, resulting to more accurate logs should errors occur.

gulp.task('imports', () => {

	glob(source, (er, files) => {
		// Add prefix and remove file extension from all files
		files = files.map(file => '"../'+file.replace('_','').split('.').slice(0, -1).join('.')+'"');

		// Convert array to string
		files = '@import '+files.join(',\n')+';'

		let heading = `//${'/'.repeat(78)}\n// Imports ${' '.repeat(60)} #imports\n//${'/'.repeat(78)}\n\n`

		fs.writeFile('dist/_imports.scss',(heading + files), null, (err) => {
			if (err) throw 'error writing file: ' + err;
			log('Created:', 'dist/_imports.scss', 'Imports file created successfully');
		});

	})

});

// =============================================================================
// Sass Docs
// =============================================================================

gulp.task('sassdoc', function () {

  var options = {
    dest: 'docs',
    verbose: true,
    shortcutIcon: './icon.png',
    display: {
      access: ['public', 'private'],
      alias: true,
      watermark: true,
    },
    groups: {
      'undefined': 'Ungrouped',
      'helpers-casts': 'Casts',
      foo: 'Foo group',
      bar: 'Bar group',
    },
    basePath: 'https://github.com/marknotton/doggistyle/src',
  };

  return gulp.src(src).pipe(sassdoc(options));
});
