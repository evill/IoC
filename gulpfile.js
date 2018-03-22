const gulp = require('gulp');
const gulpsync = require('gulp-sync')(gulp);

require('./gulp/package.task')(gulp);
require('./gulp/build.task')(gulp);
require('./gulp/tests.task')(gulp);
require('./gulp/publish.task')(gulp);

gulp.task('test_and_build', gulpsync.sync([
    'test', 'build'
]));

gulp.task('build_and_package', gulpsync.sync([
    'test_and_build', 'package'
]));

gulp.task('build_and_publish', gulpsync.sync([
    'build_and_package', 'publish'
]));



