const gulp = require('gulp');
const gulpsync = require('gulp-sync')(gulp);
const clean = require('gulp-clean');
const babel = require('gulp-babel');

const { LIB_PATH, SRC_PATH, PROJECT_ROOT } = require('./gulp.constants');

function cleanLib() {
    return gulp.src(LIB_PATH, {read: false}).pipe(clean());
}

function buildSources() {
    return gulp.src([`${SRC_PATH}/**`], { cwd: PROJECT_ROOT })
        .pipe(babel())
        .pipe(gulp.dest(LIB_PATH));

}

module.exports = (gulp) => {
    gulp.task('build', gulpsync.sync([
        'build:clean',
        'build:src'
    ]));

    gulp.task('build:clean', cleanLib);
    gulp.task('build:src', buildSources);
};
