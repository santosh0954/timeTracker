const { src, dest, watch, series, parallel} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const scss = require('gulp-sass');
const browserSync = require('browser-sync').create();
const map = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');

// Path 
const path = {
  'fontCss': './node_modules/font-awesome/css/**.min.css',
  'font': './node_modules/font-awesome/fonts/**',
  'js': ['./node_modules/jquery/dist/jquery.min.js', './node_modules/popper.js/dist/popper.min.js', './node_modules/bootstrap/dist/js/bootstrap.min.js'],
  'srcCss': './src/css',
  'srcJs': './src/js',
  'srcFont': './src/fonts',
  'scss': './scss/**/*.scss'
}

// move font 
function movefont() {
  src(path.fontCss)
  .pipe(dest(path.srcCss));
  return src(path.font)
  .pipe(dest(path.srcFont));
}

// move js 
function moveJs() {
  return src(path.js).pipe(dest(path.srcJs));
}

// scss compile 
function style() {
  return src(path.scss)
  .pipe(map.init()).pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
  .pipe(autoprefixer('last 99 version'))
  .pipe(map.write('./map')).pipe(dest(path.srcCss))
  .pipe(browserSync.stream());
}

// live reloading 
function watcher() {
  browserSync.init({
    server : {
      baseDir : './src'
    }
  });
  watch(path.scss, style);
  watch('./src/**/*.{html,js}').on('change',  browserSync.reload);
}




// exports section 

exports.move = series(movefont, moveJs);
exports.style = style;
exports.default = series(style, watcher);