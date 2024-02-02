const { request } = require("http");
const {src, dest, watch, parallel, series} = require('gulp');

//const scss = require('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const svgSprite = require('gulp-svg-sprite');
const fileInclude   = require('gulp-file-include');
const ghPages = require('gulp-gh-pages');
const webp = require('gulp-webp');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function cleanDist() {
    return del('dist');
}

function svgSprites() {
    return src('app/images/icons/*.svg')
      .pipe(
        svgSprite({
          mode: {
            stack: {
              sprite: '../sprite.svg',
            },
          },
        })
      )
          .pipe(dest('app/images'));
  }

function htmlInclude() {
    return src(['app/html/*.html'])													
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file',
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream());
  }

function images() {
    return src('app/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images'))
}

function imagesWebp() {
  return src('app/images/**/*')
  .pipe(webp())
  .pipe(dest('app/images'))
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/mixitup/dist/mixitup.js',
        'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
        'node_modules/@fancyapps/ui/dist/fancybox.umd.js',
        'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
        'node_modules/rateyo/src/jquery.rateyo.js',
        'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        'node_modules/aos/dist/aos.js',
        'node_modules/swiper/swiper-bundle.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}



function styles() {
    return src('app/scss/style.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(concat('style.min.css'))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version'],
          grid: true
      }))
      .pipe(dest('app/css'))
      .pipe(browserSync.stream());
  };

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

function deploy() {
  return src('dist/**/*')
    .pipe(ghPages());
}


function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/main.js', '!app/js/main.min.js'], scripts);
    watch('app/*html').on('change', browserSync.reload);
    watch(['app/images/icons/*.svg'], svgSprites);
    watch(['app/html/**/*.html'], htmlInclude);
};

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.imagesWebp = imagesWebp;
exports.cleanDist = cleanDist;
exports.svgSprites = svgSprites;
exports.htmlInclude = htmlInclude;
exports.deploy = deploy;

exports.build = series(cleanDist, images, build);//(cleanDist, imagesWebp, images, build)
exports.default = parallel(htmlInclude,styles, scripts, browsersync, watching, svgSprites);