const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');

gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});

// const paths = {
//     scripts: {
//         src: './app',
//         dest: './build',
//         css: './build/css',
//         js: './build/js',
//         imagesPath: './build/images'
//     }
// }
// async function buildHtml(){
//     gulp.src(['app/*.html']).pipe(gulp.dest(paths.scripts.dest))
//     gulp.src(['app/css/*.css']).pipe(gulp.dest(paths.scripts.css))
//     gulp.src(['app/js/*.js']).pipe(gulp.dest(paths.scripts.js))
//     gulp.src(['app/images/*.*']).pipe(gulp.dest(paths.scripts.imagesPath))
// }

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function cleanDist() {
    return del('dist')
}

function images() {
    return src('app/images/**/*')
        .pipe(imagemin(
            [
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ]
        ))
        .pipe(dest('dist/images'))
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}


function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ], {base: 'app'})
        .pipe(dest('dist'))
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}


exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
// exports.buildHtml = async function(){
//     buildHtml()
// }


exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);


gulp.task('deploy', function (){
    return gulp.src('./build/**/*').pipe(ghPages())
})

