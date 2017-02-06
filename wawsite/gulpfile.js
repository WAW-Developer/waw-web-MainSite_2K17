var gulp = require('gulp'),
  del = require('del'),
  runSequence = require('run-sequence'),
  argv = process.argv,
  sourcemaps = require('gulp-sourcemaps'),
  babel = require('gulp-babel'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  _argv = require('yargs').argv,
//  stripDebug = require('gulp-strip-debug'),
  jsdoc = require('gulp-jsdoc3'),
  babelify = require('babelify'),
  ifElse = require('gulp-if-else');


/**
 * Gulp task 'toES5'
 *
 * Transpiles ES6 into ES5
 *
 * - babel
 *
 */
gulp.task('toES5', function (_done) {

    var _defaultPath_ES6 = 'src/';
    var _defaultPath_ES5 = 'babel/ES5/wawsite/';

    // var _path_es6 = ['assets/babel/pages/todo/**/*.js'];
    // var _path_es5 = 'assets/babel/pages_ES5/todo';
    // var _sourceRoot = 'assets/babel/pages/todo/';

    var _path_es6 = null;
    var _path_es5 = null;
    var _sourceRoot = null;

    var _howUse = function() {
        console.log('---i--- gulp.task(toES5)');
        console.log('--???-- How to use');
        console.log('gulp toES5 [--module todo]');
    };


    if (_argv.module !== undefined) {
        _path_es6 = _defaultPath_ES6 + _argv.module + '/**/*.js';
        _sourceRoot = _defaultPath_ES6 + _argv.module;
        _path_es5 = _defaultPath_ES5 +  _argv.module;

    } else {

        /*
        console.log('---i--- gulp.task(toES5)');
        console.log('module parameter is required.');
        _howUse();
        return;
        */

        _path_es6 = _defaultPath_ES6 + '**/*.js';
        _sourceRoot = _defaultPath_ES6;
        _path_es5 = _defaultPath_ES5;
    }


    // Check 'dev' flag
    var _isDev = false;
    if (_argv.dev !== undefined) {
        _isDev = true;
    }


    return gulp.src(_path_es6)
//        .pipe(ifElse(!_isDev, stripDebug))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015'],
//            plugins: ['transform-es2015-modules-commonjs']
//            plugins: ["transform-es2015-modules-systemjs"]
            
        }))
        .pipe(sourcemaps.write('.', { sourceRoot: _sourceRoot }))
        .pipe(gulp.dest(_path_es5));

});



/**
 * Gulp task 'toBrowser'
 *
 * Transpiles ES5 modules into a ES5 compatible file for browsers
 *
 * - browserify
 *
 */
gulp.task('toBrowser', function (_done) {
  // set up the browserify instance on a task basis
    var _defaultPath_ES6 = 'src/';
    var _defaultPath_ES5 = 'babel/ES5/wawsite/';
    var _defaultPath_ES5forBrowser = 'babel/ES5forBrowser/wawsite/';
    var _standAlone_Base = 'waw.mainsite';
    
    
//    _defaultPath_ES5 = _defaultPath_ES6;    // TODO: REMOVE DEBUG TRICK

    var _howUse = function() {
        console.log('---i--- gulp.task(toBrowser)');
        console.log('--???-- How to use');
        console.log('gulp toBrowser [--module todo] --main todo_Lib.js --outfile todo_Lib-min.js');
    };

    // var _module = 'todo';
    var _module = null;
    if (_argv.module !== undefined) {
        _module = _argv.module;
    } else {
        /*
        console.log('---i--- gulp.task(toBrowser)');
        console.log('module parameter is required.');
        _howUse();
        return;
        */
    }

    // var _main = 'todo_Lib.js';
    var _main = '';
    if (_argv.main !== undefined) {
        _main = _argv.main;
    } else {
        console.log('---i--- gulp.task(toBrowser)');
        console.log('main parameter is required.');
        _howUse();
        return;
    }

    // var _outfile = 'todo_Lib-min.js';
    var _outfile = null;
    if (_argv.outfile !== undefined) {
        _outfile = _argv.outfile;
    } else {
        console.log('---i--- gulp.task(toBrowser)');
        console.log('outfile parameter is required.');
        _howUse();
        return;
    }

    // var _standAlone = 'has.api.security';
    var _standAlone = null;
    if (_argv.standAlone !== undefined) {
        _standAlone = _argv.standAlone;
    } else {

        if (_module !==  null) {
            _standAlone = _standAlone_Base + '.' + _module;
        } else {
            _standAlone = _standAlone_Base;
        }
    }



    /*
    var _entries = _defaultPath_ES5 + _module + '/' + _main;
    var _destPath = _defaultPath_ES5forBrowser + _module + '/';
    */

    var _entries = null;
    var _destPath = null;

    if (_module !== null) {
        _entries = _defaultPath_ES5 + _module + '/' + _main;
        _destPath = _defaultPath_ES5forBrowser + _module + '/';
    } else {
        _entries = _defaultPath_ES5 + _main;
        _destPath = _defaultPath_ES5forBrowser;
    }


    
//    "sourceMapRelative": "$PWD/src/js",
//    "presets": ["es2015"]

    var b = browserify ({
        entries: _entries,
        debug: true,
        outfile: _outfile,
        standalone: _standAlone,
        'transform': [
            [
              "babelify",
              {
                "sourceMapRelative": "$PWD/src",
                "presets": ["es2015"]
              }
            ]
          ]
    });

    return b.bundle()
        .pipe(source(_outfile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            // Add transformation tasks to the pipeline here.
            .pipe(uglify())
            .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(_destPath));

});



/**
 * Gulp task 'buildWAWSite'
 *
 * Build API library
 *
 * - toES5
 * - toBrowser
 *
 */
gulp.task('buildWAWSite', function (_done) {

    _argv.main = 'mainsite.js';
    _argv.outfile = 'mainsite-min.js';


    var _toBrowser = function() {
        runSequence(['toBrowser'],_done);
    };

    runSequence(['toES5'],_toBrowser);

});


/**
 * Gulp task 'copywawmsite'
 *
 * Copy waw site
 *
 * - jsdocs
 *
 */
gulp.task('copywawmsite', function (_done) {

    var _defaultPath_ES5forBrowser = 'babel/ES5forBrowser/wawsite/';
    var _fileName = 'mainsite-min.js';
    var _defaultDestinationPath = '../html/js/';

    var _filePath = _defaultPath_ES5forBrowser + _fileName;

    gulp.src(_filePath)
        .pipe(gulp.dest(_defaultDestinationPath));

    _done();

});



var _copy = function(_options) {
    _source = _options.source;
    _target = _options.target;
    _callback = _options.callback;
    
    gulp.src(_source)
    .pipe(gulp.dest(_target))
    .on('end', function () { 
        if (_callback !== undefined) {
            _callback();    
        }
        });
};


/**
 * Gulp task 'copywawmsite'
 *
 * Copy waw site
 *
 * - jsdocs
 *
 */
gulp.task('copyLib_polymer', function (_done) {

    
    var _filePath = 'bower_components/polymer/polymer-mini.html';
    var _defaultDestinationPath = '../html/js/';

//    var _filePath = _defaultPath_ES5forBrowser + _fileName;

    var _copy_Polymer = function() {
        _copy({
            'source': 'bower_components/polymer/polymer-mini.html',
            'target': _defaultDestinationPath
        });
    };
    
//    _copy(_filePath,_defaultDestinationPath,_done);
    _copy_Polymer(_done);


});




/**
 * Gulp task 'copywawmsite'
 *
 * Copy waw site
 *
 * - jsdocs
 *
 */
gulp.task('copyLib_webcomponents', function (_done) {
    
    var _defaultDestinationPath = '../html/js/';
    var _copy_webcomponents = function() {
        _copy({
            'source': 'bower_components/webcomponentsjs/webcomponents-lite.min.js',
            'target': _defaultDestinationPath,
            'callback': _done
        });
    };
    
    
});



/**
 * Gulp task 'copyLibs'
 *
 * Copy waw site
 *
 * - jsdocs
 *
 */
gulp.task('copyLibs', function (_done) {
    
    runSequence(['copyLib_polymer','copyLib_webcomponents'], _done);

    
});


/**
 * Gulp task 'buildWAWSite'
 *
 * Build API library
 *
 * - toES5
 * - toBrowser
 *
 */
gulp.task('buildandcopyWAWSite', function (_done) {
    
    var _copy = function() {
        runSequence(['copywawmsite'],_done);
    };

    runSequence(['buildWAWSite'],_copy);
    
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
