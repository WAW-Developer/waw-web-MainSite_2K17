var gulp = require('gulp'),
  del = require('del'),
  argv = process.argv,
  gutil = require('gulp-util'),
  _argv = require('yargs').argv,

  ifElse = require('gulp-if-else');



/**
 * Gulp task 'copywawmsite'
 *
 * Copy waw site
 *
 * - jsdocs
 *
 */
gulp.task('copywawmsite', function (_done) {

    var _defaultPath_ES5forBrowser = '../wawsite/babel/ES5forBrowser/wawsite/';
    var _fileName = 'mainsite-min.js';
    var _defaultDestinationPath = '../html/js/';

    var _filePath = _defaultPath_ES5forBrowser + _fileName;

    gulp.src(_filePath)
        .pipe(gulp.dest(_defaultDestinationPath));

    _done();

});


//gulp.task('build', function(done){
//    runSequence(['clean', 'buildAPI'], function () {
//        runSequence(['rollupBuild'], function () {
//            runSequence(['copyAPI'], function () {
//                runSequence(['copy3PLib'], function () {
//                    runSequence(['copyTranslations'], function () {
//                    });
//                });
//            });
//        });
//    });
//});
