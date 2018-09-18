'use strict';

const gulp     = require('gulp');
const plumber  = require('gulp-plumber');
const concat   = require('gulp-concat');
const notifier = require('gulp-notifier');
const sassdoc  = require('sassdoc');

notifier.defaults({ success : 'icon.png' });

const src = [
  'src/helpers/*/**.scss',
  'src/_settings.scss',
  'src/_properties.scss',
  'src/_placeholders.scss',
  'src/collections/**/*.scss',
];

gulp.task('compile', () => {
  return gulp.src(["src/_introduction.scss", ...src])
  .pipe(plumber({errorHandler: notifier.error }))
  .pipe(concat('_doggistyle.scss'))
  .pipe(gulp.dest('dist'))
  .pipe(gulp.dest('../../Craft Master/Website/vendor/marknotton/doggistyle/dist'))
  .pipe(notifier.success('Compiled Doggistyle successfully'))
});

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

gulp.task('watch', function () {
  gulp.watch(src, ['compile']);
});

gulp.task('default', ['compile']);
