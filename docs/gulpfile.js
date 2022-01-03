'use strict';

// @see https://github.com/marknotton/dependencies
const dependencies = require('@marknotton/dependencies')({ log : false })
const { gulp, sass, Stream, Path, postcss, postcssGulp, plumber, log } = dependencies

const task = async (done) => {

  gulp.src(['src/**/*.scss'], { 
    base       : 'src', 
    sourcemaps : false 
  }) 

  // Error Hadling -----------------------------------------------------------
  
  .pipe(plumber({ errorHandler: error => {
    if ( error.syscall == 'mkdir') { 
      log('Could not create a directory called: ' + error.path)
    } else {
      log('Line: ' + error.line, error.messageFormatted)
    }
  }}))

  // File Handler ------------------------------------------------------------
  
  .pipe(new Stream.Transform({
    objectMode: true,
    transform: function(file, encoder, callback) {
      this.push(file) 
      callback()
    }
  }))

  // Sass Renderer -----------------------------------------------------------
  
  .pipe(sass({
    outputStyle: 'compressed',
    includePaths : [
      `../library/src/`,
      `../library/src/elements/`,
      `../library/src/variables/`,
      `../library/src/helpers/`
    ]    
  }))

  // PostCSS -----------------------------------------------------------------
  
  .pipe(postcssGulp([postcss.autoprefixer]))
  
  // Output files ------------------------------------------------------------

  .pipe(gulp.dest('./', { sourcemaps : false }))

  // Logs --------------------------------------------------------------------

  .pipe(new Stream.Transform({
    objectMode: true,
    transform: function(file, encoder, callback) {
      log('Created', Path.relative(process.cwd(), file.path));
      callback();
    }
  }))

  // On Complete -------------------------------------------------------------

  .on('finish', () => { 
    log('Docs CSS task:', 'Completed', ['green', 'green']) 
    done()
  })

}

gulp.task('docs', gulp.series(task))

// Default Gulp Task -----------------------------------------------------------

exports.default	= gulp.parallel('docs')
