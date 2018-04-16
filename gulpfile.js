var gulp = require('gulp');
var server = require('gulp-webserver');
var CSS = require('gulp-sass');
var htmlmin = require('gulp-htmlmin');
var jsmin = require('gulp-uglify');
var cssmin = require('gulp-clean-css');
var sequence = require('gulp-sequence');
var data = require('./src/data/data.json');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
};
gulp.task('watch', function() {
    gulp.watch('src/css/*.scss', ['css'])
    gulp.watch('src/imgs/*.{png,jpg}', ['copyimg'])
    gulp.watch('src/*.html', ['htmlmin'])
})
gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean());
})
gulp.task('copyfonts', function() {
    return gulp.src('src/fonts2/*')
        .pipe(gulp.dest('dist/fonts2'))
})
gulp.task('copyimg', function() {
    return gulp.src('src/imgs/*')
        .pipe(gulp.dest('dist/imgs'))
})
gulp.task('copyswiper', function() {
    return gulp.src('src/swiper/*')
        .pipe(gulp.dest('dist/swiper'))
})
gulp.task("css", function() {
    return gulp.src('src/css/*.scss')
        .pipe(CSS())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'))
})
gulp.task('htmlmin', function() {
    return gulp.src('src/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'))
})
gulp.task('jsmin', function() {
    return gulp.src('src/js/*.js')
        .pipe(jsmin())
        .pipe(gulp.dest('dist/js'))
})
gulp.task('server', function() {
    gulp.src('dist')
        .pipe(server({
            port: 3335,
            open: true,
            liverload: true,
            middleware: function(req, res, next) {
                if (/\/list/g.test(req.url)) {
                    // res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8;' })
                    res.end(JSON.stringify(data));
                }
                next();
            }
        }))

})
gulp.task('default', function(cb) {
    sequence('clean', ['copyimg', 'css', 'htmlmin', 'jsmin', 'copyfonts', 'copyswiper', 'watch'], 'server', cb)
})