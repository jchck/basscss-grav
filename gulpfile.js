// Gulp tasks for jchck grav

var devUrl            =   'http://192.168.33.10';

// Load plugins
var autoprefixer      =   require('autoprefixer');
var browserSync       =   require('browser-sync').create();
var browserReload     =   browserSync.reload;
var mqpacker          =   require('css-mqpacker');
var cssnano           =   require('cssnano');
var gulp              =   require('gulp');
var imagemin          =   require('gulp-imagemin');
var postcss           =   require('gulp-postcss');
var size              =   require('gulp-size');
var uncss             =   require('gulp-uncss');
var watch             =   require('gulp-watch');
var calc              =   require('postcss-calc');
var color             =   require('postcss-color-function');
var media             =   require('postcss-custom-media');
var properties        =   require('postcss-custom-properties');
var comments          =   require('postcss-discard-comments');
var atImport          =   require('postcss-import');

// postcss plugin registry
var postcssPlugins    =   [
    atImport,
    media,
    properties,
    calc,
    color,
    comments,
    autoprefixer,
    cssnano,
    mqpacker
];

// css processing task
gulp.task('css', function() {
  gulp.src('./src/css/basecss.css')
   
   .pipe(postcss(postcssPlugins))

   .pipe(size({gzip: true, showFiles: true, title: 'Processed & gZipped!'}))

   .pipe(gulp.dest('./dest/css'))

   .pipe(browserSync.stream());
});

// image processing task
gulp.task('pics', function(){
  gulp.src('./src/img/**.*')
    .pipe(imagemin({
        verbose: true
    }))
    .pipe(gulp.dest('./dest/img/'));
});

// Initialize browser-sync which starts a static server also allows for
// browsers to reload on filesave
gulp.task('watch', function() {
    browserSync.init({

        // Be sure you start your dev server at the root of your Grav install
        proxy: devUrl,

        // Template files to watch 
        files: [
          '{templates}/**/*.html.twig',
          '*.php'
        ]
    });

    // CSS files to watch
    gulp.watch(['./src/css/**.css'], ['css']);
});

/**
 *
 * Default task
 *
 */
gulp.task('default', ['css', 'watch'], function(){
  gulp.start('css', 'pics');
  gulp.watch('src/css/**.css', ['css']);
  gulp.watch('src/img/**.*', ['img']);
  gulp.watch('**/*.html.twig', browserReload);
});