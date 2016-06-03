// Gulp tasks for jchck grav

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

gulp.task('css', function() {
  gulp.src('./src/base.css')
   
   .pipe(postcss(postcssPlugins))

   .pipe(size({gzip: true, showFiles: true, title: 'Processed & gZipped!'}))

   .pipe(gulp.dest('./dest'))

   .pipe(browserSync.stream());
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