// Gulp tasks for MNML

// Load plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    basswork = require('gulp-basswork'),
    rename = require('gulp-rename'),
    css = require('css'),

    watch = require('gulp-watch'),
    prefix = require('gulp-autoprefixer'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    csslint = require('gulp-csslint'),
    browserSync = require('browser-sync').create('mnml'),
    browserReload = browserSync.reload;

gulp.task('css', function() {
  gulp.src('./css-src/jaechick.css')
  //gulp.src('./node_modules/tachyons/src/tachyons.css')
    .pipe(basswork())
    .pipe(size({gzip: false, showFiles: true, title:'basswork css'}))
    .pipe(size({gzip: true, showFiles: true, title:'basswork gzipped css'}))
    .pipe(gulp.dest('./css'))
    .pipe(minifyCSS())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(size({gzip: false, showFiles: true, title:'basswork minified'}))
    .pipe(size({gzip: true, showFiles: true, title:'basswork minified'}))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('minify-img', function(){
  gulp.src('./img/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
    }))
    .pipe(gulp.dest('./img/'));
});

// Use csslint without box-sizing or compatible vendor prefixes (these
// don't seem to be kept up to date on what to yell about)
gulp.task('csslint', function(){
  gulp.src('./css-src/jaechick.min.css')
    .pipe(csslint({
          'compatible-vendor-prefixes': false,
          'box-sizing': false,
          'important': false,
          'known-properties': false
        }))
    .pipe(csslint.reporter());
});

// Initialize browser-sync which starts a static server also allows for
// browsers to reload on filesave
gulp.task('browser-sync', function() {
    browserSync.init({
        //server: true
        proxy: "127.0.0.1:8000"
    });
});

// Allows gulp to not break after a sass error.
// Spits error out to console
function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}

/*
   DEFAULT TASK

 • Process sass then auto-prefixes and lints outputted css
 • Starts a server on port 3000
 • Reloads browsers when you change html or sass files

*/
gulp.task('default', ['css', 'browser-sync'], function(){
  gulp.start('css', 'csslint', 'minify-img');
  gulp.watch('css-src/*', ['css']);
  gulp.watch('**/*.html.twig', browserReload);
});
