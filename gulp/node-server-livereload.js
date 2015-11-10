var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	notify = require('gulp-notify'),
	livereload = require('gulp-livereload');

gulp.task('nodemon', ['watch-app'], function() {
	 // livereload.listen();
	nodemon({
		script: 'index.js',
		ext: 'js html css',
		ignore: ['frontend/app/**/*.js', 'gulp', 'test']
	}).on('restart', function(){
		console.log('server restart');
		 // livereload.reload();
	})
})

gulp.task('watch-app', ['concat'], function() {
	gulp.watch('frontend/app/**/*.js', ['concat'])
});