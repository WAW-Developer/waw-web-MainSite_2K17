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

    var _defaultDestinationPath = '../html/js/';

    var _filePath = ['babel/ES5forBrowser/wawsite/mainsite-min.js',
        'config/config.json'];
    
    gulp.src(_filePath)
    .pipe(gulp.dest(_defaultDestinationPath))
    .on('end', function () { 
        _done()
        });

});



/**
 * Gulp task 'copyLib_polymer'
 *
 * Copy polymer library
 *
 */
gulp.task('copyLib_polymer', function (_done) {

    /*
    var _filePath = ['bower_components/polymer/polymer.html',
        'bower_components/polymer/polymer-mini.html',
        'bower_components/polymer/polymer-micro.html',
        'bower_components/webcomponentsjs/webcomponents.min.js',
        'bower_components/webcomponentsjs/webcomponents-loader.js'];
    */
    
    var _filePath = ['bower_components/polymer/**/*'];
    
    var _defaultDestinationPath = '../html/js/polymer';

    gulp.src(_filePath)
    .pipe(gulp.dest(_defaultDestinationPath))
    .on('end', function () { 
        
        
        var _webcomponenets = [
            'node_modules/webcomponents.js/webcomponents-lite.js',
            'node_modules/webcomponents.js/webcomponents-loader.js',
            'node_modules/webcomponents.js/custom-elements-es5-adapter.js'
        ];
        
        
        gulp.src(['node_modules/webcomponents.js/**'])
        .pipe(gulp.dest('../html/js/webcomponents/'))
        .on('end', function () {
            
            gulp.src(['bower_components/shadycss/**/*'])
            .pipe(gulp.dest('../html/js/shadycss/'))
            .on('end', function () {
                _done();
            });
            
        });
        
        //_done()
    });
    
});


/**
 * Gulp task 'copyLib_jQuery'
 *
 * Copy jQuery library
 *
 */
gulp.task('copyLib_jQuery', function (_done) {
    
    var _filePath = ['bower_components/jquery/dist/jquery.min.js'];
    
    var _defaultDestinationPath = '../html/js/';
    
    gulp.src(_filePath)
    .pipe(gulp.dest(_defaultDestinationPath))
    .on('end', function () { 
        _done()
        });
    
});




/**
 * Gulp task 'copyLib_bootstrap'
 *
 * Copy bootstrap library
 *
 */
gulp.task('copyLib_bootstrap', function (_done) {
    
    var _filePath = ['bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/jquery/dist/jquery.min.js'];
    
    var _defaultDestinationPath = '../html/js/bootstrap/js/';
    
    gulp.src(_filePath)
    .pipe(gulp.dest(_defaultDestinationPath))
    .on('end', function () { 
        
        gulp.src(['bower_components/tether/dist/css/tether.min.css',
            'bower_components/tether/dist/js/tether.min.js'])
        .pipe(gulp.dest('../html/js/tether/'))
        .on('end', function () { 
            _done();
        });

//    _done();
    });
    
});


/**
 * Gulp task 'copyLib_bootstrapComponents'
 *
 * Copy bootstrap components library
 *
 */
gulp.task('copyLib_bootstrapComponents', function (_done) {
    
    var _filePath = ['bower_components/bs4-custom-elements/dist/html/*'];
    
    var _defaultDestinationPath = '../html/webcomponents/bs4/';
    
    gulp.src(_filePath)
    .pipe(gulp.dest(_defaultDestinationPath))
    .on('end', function () { 
        _done();
    });
    
});



/**
 * Gulp task 'copyLib_bootstrap_glyphicons'
 *
 * Copy bootstrap glyphicons library
 *
 */
gulp.task('copyLib_bootstrap_glyphicons', function (_done) {
    
    var _filePath = ['bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
        'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
        'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
        'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
        'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'];
    
    var _defaultDestinationPath = '../html/js/bootstrap/fonts/';
    
    gulp.src(_filePath)
    .pipe(gulp.dest(_defaultDestinationPath))
    .on('end', function () { 
        _done()
        });
    
});




/**
 * Gulp task 'copyLib_fontawesome'
 *
 * Copy fontawesome library
 *
 */
gulp.task('copyLib_fontawesome', function (_done) {
    
    var _filePath = ['bower_components/font-awesome/fonts/*'];
    
    var _defaultDestinationPath = '../html/js/font-awesome/fonts/';
    
    gulp.src(_filePath)
    .pipe(gulp.dest(_defaultDestinationPath))
    .on('end', function () { 
        
        gulp.src(['bower_components/font-awesome/css/font-awesome.min.css'])
        .pipe(gulp.dest('../html/js/font-awesome/css/'))
        .on('end', function () { 
           
            
          _done();
        });

        
    // _done();
    });


});



/**
 * Gulp task 'copyLib_ChartJS'
 *
 * Copy ChartJS library
 *
 */
gulp.task('copyLib_ChartJS', function (_done) {
    
    var _filePath = ['bower_components/chart.js/dist/Chart.min.js'];
    
    var _defaultDestinationPath = '../html/js/chart.js/';
    
    gulp.src(_filePath)
    .pipe(gulp.dest(_defaultDestinationPath))
    .on('end', function () { 
      _done();
    });

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
    
    runSequence(['copyLib_jQuery', 
        'copyLib_polymer', 
        'copyLib_bootstrap', 
        'copyLib_fontawesome', 
        'copyLib_bootstrapComponents',
        'copyLib_ChartJS'], 
        _done);
    
});




/**
 * Gulp task 'copy_WebComponents'
 *
 * Copy web components
 * (since current 'web components' are not transpiled is not necessary to copy...)
 * 
 *
 */
gulp.task('copy_WebComponents', function (_done) {
    
    var _filePath = ['webcomponents/*.html'];
    var _defaultDestinationPath = '../html/webcomponents/';
    
    gulp.src(_filePath)
    .pipe(gulp.dest(_defaultDestinationPath))
    .on('end', function () { 
        _done()
        });
    
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
//        runSequence(['copywawmsite', 'copy_WebComponents'],_done);
        runSequence(['copywawmsite'],_done);
    };

    runSequence(['buildWAWSite'],_copy);
    
});


/**
 * Gulp task 'copyLibs'
 *
 * Copy waw site
 *
 * - jsdocs
 *
 */
gulp.task('buildAndDeployAll', function (_done) {
    
//    runSequence(['buildandcopyWAWSite', 'copyLibs', 'copy_WebComponents'], _done);
    runSequence(['buildandcopyWAWSite', 'copyLibs'], _done);
    
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
