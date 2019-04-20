var gulp = require('gulp');
var { series, parallel } = require('gulp');
var $    = require('gulp-load-plugins')();

var sassPaths = [
	'node_modules/foundation-sites/scss',
	'node_modules/motion-ui/src'
];

gulp.task('sass', function() {
	return gulp.src('app/scss/bootstrap.scss')
		.pipe($.sass({
			includePaths: sassPaths,
			outputStyle: 'compressed' // if css compressed **file size**
		})
			.on('error', $.sass.logError))
		.pipe($.autoprefixer({
			browsers: ['last 2 versions', 'ie >= 9']
		}))
		.pipe(gulp.dest('dev/css/'));
});

gulp.task('default', ['sass'], function() {
  gulp.watch(['app/scss/**/*.scss'], ['sass']);
});
