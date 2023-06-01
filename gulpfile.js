"use strict";

const browsersync = require("browser-sync").create();
const gulp = require('gulp');
var sass = require('gulp-sass')(require('sass')); 
const autoprefixer = require("autoprefixer");
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');
var reload = browsersync.reload;

// == Browser-sync task
gulp.task("browser-sync", function(done){
    browsersync.init({
      server: "./",
      startPath: "./index.html",
      //    browser: 'chrome',
      host: 'localhost',
      //    port: 4000,
      open: true,
      tunnel: true 
    });
    gulp.watch(["./**/*.html"]).on("change", reload);
    done(); 
  });


// CSS task
gulp.task("css", () => {
  return gulp
    .src("./scss/index.scss")
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(minify())
    .pipe(gulp.dest('dist/css')) // change to your final/public directory
    .pipe(browsersync.stream())
});

//optimize and move images
    gulp.task("optimizeimg", () => {
        return gulp
  .src('./images/*.{jpg,png}') // change to your source directory
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 80, progressive: true }),
      imagemin.optipng({ optimizationLevel: 2 }),
    ]))
    .pipe(gulp.dest('dist/images')) // change to your final/public directory
});

//optimize and move images
gulp.task("webpImage", () => {
        return gulp
     .src('dist/images/*.{jpg,png}') // change to your source directory
    .pipe(imagewebp())
    .pipe(gulp.dest('dist/images')) // change to your final/public directory
});


// minify js
gulp.task("js", () => {
        return gulp
  .src('./js/*.js') // change to your source directory
    .pipe(terser())
    .pipe(gulp.dest('dist/js')); // change to your final/public directory
});

// //watchtask
// function watchTask(){
//   watch('./scss/*.scss', compilescss); // change to your source directory
//   watch('./js/*.js', jsmin); // change to your source directory
//   watch('./images/*', optimizeimg); // change to your source directory
//   watch('dist/images/*.{jpg,png}', webpImage); // change to your source directory
// }


// // Default Gulp task 
// exports.default = series(
//   compilescss,
//   jsmin,
//   optimizeimg,
//   webpImage,
//   watchTask
// );

gulp.task("default", gulp.series( "css", "js", "optimizeimg", "webpImage", () => {
    gulp.watch("./scss/**/*", gulp.series("css")); // change to your source directory
    gulp.watch('./js/**/*', gulp.series("js")); // change to your source directory
    gulp.watch('./images/*', gulp.series("optimizeimg")); // change to your source directory
    gulp.watch('dist/images/*.{jpg,png}', gulp.series("webpImage")); // change to your source directory
  }));
  