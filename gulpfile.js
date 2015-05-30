// Gulp tasks for jchck mnml

// Load plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    basswork = require('gulp-basswork'),
    rename = require('gulp-rename'),
    css = require('css'),
    cssnext = require('gulp-cssnext'),
    watch = require('gulp-watch'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    browserReload = browserSync.reload;

gulp.task('css', function() {
  gulp.src('./src/base.css')
    .pipe(basswork())
    .pipe(cssnext({compress: true}))
    .pipe(rename({basename: 'jchck'}))
    .pipe(size({gzip: false, showFiles: true, title:'basswork css'}))
    .pipe(size({gzip: true, showFiles: true, title:'basswork gzipped css'}))
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

// Initialize browser-sync which starts a static server also allows for
// browsers to reload on filesave
gulp.task('browser-sync', function() {
    browserSync.init({
        // Be sure you start your dev server at the root of your Grav install
        // `$ php -S 127.0.0.1:8000`
        proxy: "127.0.0.1:8000"
    });
});

// Allows gulp to not break after an error.
// Spits error out to console
function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}

/*
   DEFAULT TASK

 • Process css and lints outputted css
 • Starts a server on port 3000
 • Reloads browsers when you change html.twig or css files

*/
gulp.task('default', ['css', 'browser-sync'], function(){
  gulp.start('css', 'minify-img');
  gulp.watch('src/*', ['css']);
  gulp.watch('**/*.html.twig', browserReload);
});