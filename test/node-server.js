
'use strict';

var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;

gulp.task('server', function() {
  if (node) node.kill()
  node = spawn('node', ['index.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})

gulp.task('watch-server', function() {
  gulp.run('server')

  gulp.watch(['./index.js', './lib/**/*.js'], function() {
    gulp.run('server')
  })
})

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
})