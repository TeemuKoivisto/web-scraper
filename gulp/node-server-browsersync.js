var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	browserSync = require('browser-sync');
	
var reload = browserSync.reload;

gulp.task('browser-sync', ['nodemonb'], function() {
	browserSync({
		proxy: "localhost:4000",
		port: 5000,
		notify: true
	});
});	
	
gulp.task('nodemonb', ['watch-appp'], function() {
	return nodemon({
		script: 'index.js',
		ext: 'js html css',
		ignore: ['frontend/app/**/*.js', 'gulp', 'test']
	}).on('restart', function(){
		console.log('server restart');
		setTimeout(function () {
			reload({ stream: false });
		}, 1000);
	})
})

gulp.task('watch-appp', ['concat'], function() {
	gulp.watch('frontend/app/**/*.js', ['concat'])
});

gulp.task('browser', ['browser-sync'], function () {
	gulp.watch(['frontend/**/*.html', 'frontend/all.js', 'routes/**/*'], reload);
});