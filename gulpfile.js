var gulp = require('gulp');
var sync = require('browser-sync');
var stylus = require('gulp-stylus');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var combiner = require('stream-combiner2');
var clean = require('gulp-clean');
var cdn = require('gulp-cdn-absolute-path');
var md5 = require('gulp-md5-plus');
var webpack = require('gulp-webpack');
var httpProxy = require('http-proxy-middleware');

//合并文件流，处理异常
var combine = function(tasks) {
  var combined = combiner.obj(tasks);
  combined.on('error', console.error.bind(console));
  return combined;
};

var webpackConfig = {
  entry: './src/javascripts/main.js',
  output: {
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.(jpg|png)$/i,
        loader: 'url'
      }
    ]
  }
};

//压缩js
gulp.task('jsmin', function() {
  return combine([
    gulp.src('src/javascripts/**/**.js'),
    uglify(),
    gulp.dest('dist/javascripts')
  ]);
});

//压缩css
gulp.task('cssmin', function() {
  return combine([
    gulp.src('src/stylesheets/css/*.css'),
    cssmin(),
    gulp.dest('dist/stylesheets/css')
  ]);
});

//stylus编译
gulp.task('stylus', function() {
  return combine([
    gulp.src('src/stylesheets/styl/*.styl'),
    stylus(),
    gulp.dest('src/stylesheets/css')
  ]);
});

//html
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('data', function() {
  return gulp.src('src/data/**')
    .pipe(gulp.dest('dist/data'));
});

gulp.task('img', function() {
  return gulp.src('src/images/**')
    .pipe(gulp.dest('dist/images'))
});

//发布
gulp.task('dist', ['clean'], function() {
  gulp.start(['cssmin', 'jsmin', 'html', 'img', 'data']);
});

//cdn
gulp.task('cdn', function() {
  return gulp.src('src/*.html')
    .pipe(cdn({asset: 'src', cdn: 'http://cdn.lizhi.fm/web_res/market/h5/congra'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('md5Css', ['buildHtml'], function() {
  return gulp.src('css/*.css')
    .pipe(md5(8, 'build/html/*.html'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('buildJs', ['buildCss'], function() {
  return gulp.src('js/*.js')
    .pipe(md5(8, 'build/html/*.html'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('webpack', function() {
  return combine([
    gulp.src('src/javascripts/main.js'),
    webpack(webpackConfig),
    gulp.dest('src/javascripts')
  ]);
});

//清理dist
gulp.task('clean', function() {
  return gulp.src('dist').pipe(clean());
});

//自动刷新
gulp.task('dev', function() {
  sync.init({
    server: {baseDir: './src'},
    notify: false,
    ui: false
  });
  gulp.watch(['src/stylesheets/**/*.styl']).on('change', function() {
    gulp.start('stylus');
  });
  gulp.watch(['src/javascripts/**/*.vue', 'src/javascripts/**/*.js']).on('change', function() {
    // gulp.start('webpack');
  });
  gulp.watch(['**/*.html', '**/main.css', '**/javascripts/**/*.js', 'src/images/*'])
    .on('change', sync.reload);
});

gulp.task('serv', function() {
  sync.init({
    server: {baseDir: './dist'},
    middleware: [proxy],
    notify: false,
    port: 3002
  });
});