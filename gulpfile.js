'use strict';

const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const exorcist = require('exorcist');
const gulp = require('gulp');
const notify = require('gulp-notify');
const source = require('vinyl-source-stream');
const transform = require('vinyl-transform');
const watchify = require('watchify');
const jsdoc = require('gulp-jsdoc3');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');


const jsSource = {
    dev: {
        name: 'dev',
        entry: './index.es6',
        build: 'd3-charts-dto.js',
        dest: './'
    },
    test: {
        name: 'test',
        entry: './spec/javascripts/indexSpec.es6',
        build: 'indexSpec.js',
        dest: './spec/build'
    }
};

function handleErrors() {
    const args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

gulp.task('dev', function dev() {
    return build(jsSource.dev, false);
});

gulp.task('test', function test() {
    return build(jsSource.test, false);
});

gulp.task('watch-dev', function watchDev() {
    return watch(jsSource.dev, false);
});

gulp.task('watch-test', function watchTest() {
    return watch(jsSource.test, false);
});


gulp.task('watch', ['watch-dev', 'watch-test']);

gulp.task('build', ['dev', 'test', 'sass']);


gulp.task('sass', function () {
    return gulp.src('./lib/sass/d3-charts-dto.scss')
        .pipe(sass({
            precision: 8,
            includePaths: [
                './lib/sass/',
                './node_modules'
            ]
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);

gulp.task('doc', function (cb) {
    gulp.src(['README.md', './lib/javascripts/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});

function bundle(env, bundler, minify, catchErrors) {
    let result = bundler.bundle();
    if (catchErrors) {
        // Display errors to the user, and don't let them propagate.
        result = result.on('error', handleErrors);
    }
    result = result
        .pipe(source(env.build))
        .pipe(buffer());
    result = result
        // Extract the embedded source map to a separate file.
        .pipe(transform(function() { return exorcist(env.dest + '/' + env.build + '.map'); }))
        // Write the finished product.
        .pipe(gulp.dest(env.dest));

    return result;
}

function build(env) {
    return bundle(env, browserify({
        entries: env.entry,
        debug: true,
        extensions: ['.es6'],
        paths: ['./node_modules', './lib/javascripts/']
    }).transform(babelify, {presets: ['es2015'], plugins: [
      "transform-proto-to-assign",
      ["transform-es2015-classes", {
        "loose": true
      }]
    ], sourceMaps: false}), true, false);
}

function watch(env, minify) {
    const bundler = watchify(browserify({
        entries: env.entry,
        debug: true,
        cache: {},
        extensions: ['.es6'],
        packageCache: {},
        paths: ['./node_modules', './lib/javascripts/']
    }).transform(babelify, {presets: ['es2015'], plugins: [
      "transform-proto-to-assign",
      ["transform-es2015-classes", {
        "loose": true
      }]
    ], sourceMaps: false}), { poll: 1000 });

    function rebundle(ids) {
        // Don't rebundle if only the version changed.
        if (ids && ids.length === 1 && (/\/version\.js$/).test(ids[0])) {
            return false;
        }
        const start = new Date();
        const result = bundle(env, bundler, minify, true);
        result.on('end', function() {
            console.log('Rebuilt ' + env.build + ' in ' + (new Date() - start) + ' milliseconds.');
        });
        return result;
    }

    bundler.on('update', rebundle);
    return rebundle();
}
