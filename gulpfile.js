var gulp = require('gulp');
  watch = require('gulp-watch'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  util = require('gulp-util'),
  plumber = require('gulp-plumber'),
  concat = require('gulp-concat'),

  jshint = require('gulp-jshint'),
  jscs = require('gulp-jscs'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),

  cache = require('gulp-cached'),

  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),

  webserver = require('gulp-webserver'),

  imagemin = require('gulp-imagemin');

function errorNotify(error){
  notify.onError("Error: <%= error.message %>")
  util.log(util.colors.red('Error'), error.message);
}

gulp.task('javascript', function() {
  gulp.src('js/main.js')
  .pipe(sourcemaps.init())
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jscs('.jscsrc'))
  .on('error', errorNotify)
  .pipe(uglify())
  .on('error', errorNotify)
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write('/'))
  .on('error', errorNotify)
  .pipe(gulp.dest('js'))
  .pipe(notify({ message: 'Javascript task complete' }));
});

gulp.task('javascript-library', function() {
  gulp.src('js/library/*.js')
  .pipe(concat('library.js'))
  .pipe(gulp.dest('js'))
  .pipe(notify({ message: 'Javascript Library task complete' }));
});

gulp.task('style', function() {
  return gulp.src('css/site.styl')
  .pipe(plumber())
  .pipe(stylus())
  .on('error', errorNotify)
  .pipe(autoprefixer())
  .on('error', errorNotify)
  .pipe(gulp.dest('css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .on('error', errorNotify)
  .pipe(gulp.dest('css'))
  .pipe(notify({ message: 'Style task complete' }));
});

gulp.task('images', function () {
    return gulp.src('src/images/*.*')
    .pipe(cache('images'))
    .pipe(imagemin({
      progressive: false
    }))
    .on('error', errorNotify)
    .pipe(gulp.dest('img/dist'))
		.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('watch', function() {
  gulp.watch(['js/main.js'], ['javascript']);
  gulp.watch(['js/library/*.js'], ['javascript-library']);
  gulp.watch(['css/site.styl'], ['style']);
  gulp.watch(['img/src/**'], ['images']);
});

gulp.task('webserver', function() {
  gulp.src('')
    .pipe(webserver({
      livereload: true,
      port: 3000,
      fallback: 'index.html',
      open: true
    }));
});

gulp.task('default', ['webserver', 'watch']);
gulp.task('build', ['images', 'style', 'javascript-library', 'javascript']);
