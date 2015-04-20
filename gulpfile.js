var del = require('del'),
    gulp = require('gulp'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    sass = require('gulp-ruby-sass'),

    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),

    imagemin = require('gulp-imagemin'),

    connect = require('gulp-connect');
    
    // concat = require('gulp-concat'),
    // cache = require('gulp-cache'),
    // livereload = require('gulp-livereload'),
    // del = require('del'),


gulp.task('css', function() {
  return sass('./main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('js', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './main.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: []
  });

  return b.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('img', function() {
  return gulp.src('img/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/img'], cb)
});

gulp.task('connect', function() {
  connect.server({
    root: '.',
    port: 8888,
    livereload: true
  });
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('*.js', ['js']);
    gulp.watch('*.scss', ['css']);
    gulp.watch('img/*.*', ['img']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('css', 'js', 'img');
});