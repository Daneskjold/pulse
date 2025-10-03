const {src, dest, watch, parallel} = require('gulp');

const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer').default;
const rename = require('gulp-rename');


function styles() {
    return src('src/sass/**/*.scss')
        .pipe(sass({style: 'compressed'}).on('error', sass.logError))
        .pipe(rename('style.min.css'))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream());
}

function watching() {
    watch(['src/sass/**/*.scss'], styles)
    watch(['src/**/*.html']).on('change', browserSync.reload)
    watch(['src/js/*.js']).on('change', browserSync.reload);
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;

exports.default = parallel(styles, watching, browsersync);