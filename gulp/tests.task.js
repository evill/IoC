const gulp = require('gulp');
const mocha = require('gulp-mocha');

function runTests() {
    return gulp.src(['tests/unit/**/*.js', 'tests/unit/*.js'], {read: false})
        .pipe(mocha({
            ui: 'bdd',
            require: ['./tests/helpers'],
            compilers: ['js:babel-register']
        }))
}

module.exports = (gulp) => {
    gulp.task('test', runTests);
};
