const {src, dest, watch, parallel, series} = require('gulp');

const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer').default;
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');



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
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
    watch(['src/sass/**/*.scss'], styles)
    watch(['src/**/*.html']).on('change', parallel(html))
    watch(['src/**/*.html']).on('change', browserSync.reload)
    watch(['src/js/*.js']).on('change', browserSync.reload);
}

function html() {
    return src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist/'))
}

function cleanDist() {
    return src('dist')
        .pipe(clean());
}

function building() {
    return src([
        'src/css/style.min.css',
        'src/js/**/*.js',
        'src/fonts/*',
        'src/icons/**/*'
    ], {base : 'src', encoding: false})
    .pipe(dest('dist'));
}

function images() {
    return src('src/img/**/*.+(png|jpg|svg)', {base : 'src', encoding: false})
        .pipe(imagemin())
        .pipe(dest('dist/'))
}

exports.styles = styles;
exports.watching = watching;
exports.building = building;
exports.images = images;

exports.build = series(cleanDist, building)
exports.default = parallel(styles, watching);