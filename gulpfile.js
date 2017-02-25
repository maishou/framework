// including plugins
var gulp = require('gulp'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    include = require("gulp-include"),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    prefix = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    siteUrl = "http://192.168.0.105/framework/dist/ ";

// Clean
gulp.task('clean:dist', function () {
    return del([
    'dist/*'
  ]);
});

// Optimize Images
gulp.task('images', function () {
    return gulp.src('app/img/**/*')
    .pipe(imagemin({
        progressive: true,
        jpegtranPlugins: [{removeViewBox: false}],
        optipngPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('dist/img/'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        proxy: siteUrl,
        reloadDelay: 300
    });
    gulp.watch("app/scss/**/*.scss", ['sass']);
    gulp.watch("app/**/*.html", ['html']);
    gulp.watch("app/**/*").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/**/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix('last 1 versions'))
    // .pipe(cleanCSS({compatibility: 'ie10'}))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream());
});

// HTML
gulp.task('html', function () {
    gulp.src(['app/*.html', '!app/scss/**/*', '!app/scss', '!app/**/*.DS_Store'])
    .pipe(include())
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['clean:dist', 'html', 'images', 'serve']);
