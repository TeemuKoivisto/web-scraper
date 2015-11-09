'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),
	wrench = require('wrench');
	
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
	return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
	require('./gulp/' + file);
});

gulp.task('concat', function() {
	gulp.src(['frontend/app/app.module.js', 'frontend/app/**/*.js'])
	.pipe(concat('all.js'))
	.pipe(gulp.dest('frontend/'))
	// .pipe(livereload())
});

gulp.task('watch', ['start-livereload', 'concat'], function() {
	gulp.watch('frontend/app/**/*.js', ['concat', 'refresh'])
	.on('change', livereload.changed);
});

gulp.task('refresh', function() {
	// livereload()
	livereload.reload()
})

gulp.task('start-livereload', function() {
	livereload.listen();
	connect.server({
		livereload: true,
		port: '3000',
		root: 'frontend'
	})
})