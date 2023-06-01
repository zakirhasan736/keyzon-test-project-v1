"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const concat = require('gulp-concat');
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagewebp = require('gulp-webp');
var sass = require('gulp-sass')(require('sass'));
const livereload = require('gulp-livereload');
var reload = browsersync.reload;



// == Browser-sync task
gulp.task("browser-sync", function (done) {
  browsersync.init({
    server: "./",
    startPath: "/pages/index.html", 
    //    browser: 'chrome',
    host: 'localhost',
       port: 4040,
    open: true,
    tunnel: true
  });
  gulp.watch(["./**/*.html"]).on("change", reload); 
  done();
});

// CSS task
gulp.task("css", () => {
  return gulp
    .src("assets/scss/style.scss")
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(minify())
    .pipe(gulp.dest("dist/css"))
    .pipe(browsersync.stream())
    .pipe(livereload())
});

// Webfonts task
gulp.task("webfonts", () => {
  return (
  gulp
    .src("assets/scss/vendor/webfonts/*.{ttf,woff,woff2,eot,svg}")
    .pipe(gulp.dest('dist/css/webfonts'))
    );
});

//optimize and move images
gulp.task("webpImage", () => {
  return( 
  gulp
.src('assets/images/*.{jpg,png}')
.pipe(imagewebp())
.pipe(gulp.dest('dist/images'))
);
});


// Transpile, concatenate and minify scripts
gulp.task("js", () => {
  return (
    gulp
      .src([
        'assets/js/jquery-3.6.0.min.js',
        'assets/js/popper.min.js',
        'assets/js/bootstrap.min.js',
        'assets/js/general.js'
      ])
      // folder only, filename is specified in webpack config
      .pipe(concat('app.js'))
      .pipe(terser())
      .pipe(gulp.dest("dist/js"))
      .pipe(browsersync.stream())
      .pipe(livereload())
  );
});

gulp.task("default", gulp.series("css", "js", "webfonts", "webpImage", "browser-sync", () => {
  livereload.listen();
  gulp.watch(["assets/scss/**/*"], gulp.series("css"));
  gulp.watch(["assets/js/**/*"], gulp.series("js"));
  gulp.watch(["assets/scss/vendor/fontawesome/webfonts/*"], gulp.series("webfonts"));
  gulp.watch('assets/images/*.{jpg,png}', gulp.series("webpImage")); 
}));





