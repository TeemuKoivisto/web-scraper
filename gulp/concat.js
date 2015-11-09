'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat');
	
gulp.task('concats', function() {
	gulp.src(['frontend/app/app.module.js', 'frontend/app/**/*.js'])
	.pipe(concat('all.js'))
	.pipe(gulp.dest('frontend/'))
});