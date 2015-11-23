var gulp = require('gulp');
var fs   = require('fs');

// Third part extension using redCORE
try {
	var config = require('../../../../build/gulp-config.json');
}
catch(err) {
	var config = require('../../../build/gulp-config.json');
}

// Dependencies
var browserSync = require('browser-sync');
var del         = require('del');
var less        = require('gulp-less');
var minifyCSS   = require('gulp-minify-css');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');

var baseTask  	= 'media.redcore';
var baseFolder  = fs.existsSync('./redCORE') ? './redCORE' : '..';
var extPath = baseFolder + '/extensions/media/redcore';
var buildPath = baseFolder + '/build';

var excludedMediaScriptFolders = [
	'!' + buildPath + '/media/**/*.min.js',
	'!' + buildPath + '/media/**/Gruntfile.js',
	'!' + buildPath + '/media/**/gulpfile.js',
	'!' + buildPath + '/media/lib/jquery-noconflict.js'
];

var excludedMediaStypeFolders = [
	'!' + buildPath + '/media/**/*.min.css'
];

// Clean
gulp.task('clean:' + baseTask, function() {
	return del(config.wwwDir + '/media/redcore', {force: true});
});

// Copy
gulp.task('copy:' + baseTask, ['clean:' + baseTask],
	function() {
		return gulp.src([
				extPath + '/**',
				extPath + '/**/.gitkeep'
			])
			.pipe(gulp.dest(config.wwwDir + '/media/redcore'))/* &&
			gulp.src(extPath + '/../redcore.xml')
					.pipe(gulp.dest(config.wwwDir + '/administrator/components/com_redcore'))*/;
});

// LESS
gulp.task('less:' + baseTask,
	[
		'less:' + baseTask + ':component',
		'less:' + baseTask + ':component.bs3'
	],
	function() {
});

// LESS: Component
gulp.task('less:' + baseTask + ':component', function () {
	return gulp.src(buildPath + '/media/less/component.less')
		.pipe(less({paths: [buildPath + '/media/less']}))
		.pipe(gulp.dest(buildPath + '/media/css'))
		.pipe(gulp.dest(config.wwwDir + '/media/redcore/css'))
		.pipe(minifyCSS())
		.pipe(rename(function (path) {
				path.basename += '.min';
		}))
		.pipe(gulp.dest(extPath + '/css'))
		.pipe(gulp.dest(config.wwwDir + '/media/redcore/css'));
});

// LESS: Component Bootstrap3
gulp.task('less:' + baseTask + ':component.bs3', function () {
	return gulp.src(buildPath + '/media/less/component.bs3.less')
		.pipe(less({paths: [buildPath + '/media/less']}))
		.pipe(gulp.dest(buildPath + '/media/css'))
		.pipe(gulp.dest(config.wwwDir + '/media/redcore/css'))
		.pipe(minifyCSS())
		.pipe(rename(function (path) {
				path.basename += '.min';
		}))
		.pipe(gulp.dest(extPath + '/css'))
		.pipe(gulp.dest(config.wwwDir + '/media/redcore/css'));
});

// Scripts
gulp.task('scripts:' + baseTask, function () {
	return gulp.src(excludedMediaScriptFolders.concat([
				buildPath + '/media/**/*.js'
		]))
		.pipe(gulp.dest(config.wwwDir + '/media/redcore'))
		.pipe(uglify())
		.pipe(rename(function (path) {
				path.basename += '.min';
		}))
		.pipe(gulp.dest(extPath + ''))
		.pipe(gulp.dest(config.wwwDir + '/media/redcore'));
});

// Styles
gulp.task('styles:' + baseTask, function () {
	return gulp.src(excludedMediaStypeFolders.concat([
			buildPath + '/media/**/*.css'
		]))
		.pipe(gulp.dest(config.wwwDir + '/media/redcore'))
		.pipe(minifyCSS())
		.pipe(rename(function (path) {
				path.basename += '.min';
		}))
		.pipe(gulp.dest(extPath + ''))
		.pipe(gulp.dest(config.wwwDir + '/media/redcore'));
});

// Library files (fonts, images, ...)
gulp.task('libraries:' + baseTask, function () {
	return gulp.src([buildPath + '/media/lib/**',
				'!' + buildPath + '/media/lib/**/*.css',
				'!' + buildPath + '/media/lib/**/*.js',
				'!' + buildPath + '/media/lib/**/*.md'
		])
		.pipe(gulp.dest(extPath + '/lib'))
		.pipe(gulp.dest(config.wwwDir + '/media/redcore/lib'));
});

// Watch
gulp.task('watch:' + baseTask,
	[
		'watch:' + baseTask + ':less',
		'watch:' + baseTask + ':scripts',
		'watch:' + baseTask + ':styles',
		'watch:' + baseTask + ':libraries'
	],
	function() {
});

// Watch: LESS
gulp.task('watch:' + baseTask + ':less',
	function() {
		gulp.watch(
			[buildPath + '/media/less/**/*.less'],
			{ interval: config.watchInterval },
			['less:' + baseTask, browserSync.reload]
		);
});

// Watch: Scripts
gulp.task('watch:' + baseTask + ':scripts',
	function() {
		gulp.watch(excludedMediaScriptFolders.concat([
			buildPath + '/media/**/*.js'
		]),
		{ interval: config.watchInterval },
		['scripts:' + baseTask, browserSync.reload]);
});

// Watch: Styles
gulp.task('watch:' + baseTask + ':styles',
	function() {
		gulp.watch(excludedMediaStypeFolders.concat([
			buildPath + '/media/**/*.css'
		]),
		{ interval: config.watchInterval },
		['styles:' + baseTask, browserSync.reload]);
});

// Watch: Library files (fonts, images, ...)
gulp.task('watch:' + baseTask + ':libraries',
	function() {
		gulp.watch([
			buildPath + '/media/lib/**',
			'!' + buildPath + '/media/lib/**/*.css',
			'!' + buildPath + '/media/lib/**/*.js',
			'!' + buildPath + '/media/lib/**/*.md'
		],
		{ interval: config.watchInterval },
		['libraries:' + baseTask, browserSync.reload]);
});
