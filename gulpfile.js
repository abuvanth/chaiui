'use strict';

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minify = require('gulp-uglify'),
    maps = require('gulp-sourcemaps');

gulp.task('compileSass', function () {
    return gulp.src([
        './sass/chai.scss'
    ])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('minifySass', function() {
    return gulp.src([
        './sass/*.scss'
    ])
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename("chai.min.css"))
        .pipe(maps.write("./"))
        .pipe(gulp.dest('./dist/css'))
});

gulp.task("concatJs", function() {
    return gulp.src([
        "js/libs/*.js",
        "js/core.js",
        "js/components/*.js"
    ])
        .pipe(maps.init())
        .pipe(concat("chai.js"))
        .pipe(maps.write("./"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("minifyJs", function() {
    return gulp.src([
        "./dist/js/chai.js"
    ])
        .pipe(minify())
        .pipe(rename("chai.min.js"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("default", ["compileSass", "concatJs"], function () {
    gulp.start("minifySass", "minifyJs");
});

gulp.task("watch", function() {
    gulp.watch(["./sass/*.scss", "./sass/**/*.scss"], ["compileSass"]);
    gulp.watch(["./js/*.js", "./js/**/*.js"], ["concatJs"]);
});