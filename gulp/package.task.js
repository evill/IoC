const gulp = require('gulp');
const filter = require('gulp-filter');
const clean = require('gulp-clean');
const gulpsync = require('gulp-sync')(gulp);
const jeditor = require("gulp-json-editor");
const replace = require('gulp-replace');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const babel = require('gulp-babel');
const packageJson = require('../package.json');
const { DIST_PATH, SRC_PATH, LIB_PATH, DIST_PACKAGE_PATH, DIST_PACKAGE_ABSOLUTE_PATH, PROJECT_ROOT } = require('./gulp.constants');

function cleanDist() {
    return gulp.src(DIST_PATH, {read: false}).pipe(clean());
}

function copyPackageSrcFiles() {
    return gulp.src([
        '**',
        ...excludeFolders(DIST_PATH, 'node_modules', SRC_PATH, 'tests', 'gulp', 'doc'),
        '!README.md', '!package.json', '!gulpfile.js'
    ], { cwd: PROJECT_ROOT })
        .pipe(gulp.dest(DIST_PACKAGE_PATH));
}

function modifyPackageJson() {
    return gulp.src('package.json')
        .pipe(jeditor((json) => {
            delete json.devDependencies;
            delete json.scripts;
            json.main = json.main.replace(SRC_PATH, LIB_PATH);

            return json;
        }))
        .pipe(gulp.dest(DIST_PACKAGE_PATH));
}

function modifyDocumentation() {
    const branchNameRaw = fs.readFileSync('.git/HEAD', { encoding: 'utf8' }).match(/ref: refs\/heads\/(.+)/)[1];

    return gulp.src('README.md')
        .pipe(replace(/\.\/(doc.*)/g, `${packageJson.repository.url}/tree/${branchNameRaw}/$1`))
        .pipe(gulp.dest(DIST_PACKAGE_PATH));
}

function zipPackage() {
    const stdout = execSync('npm pack', { cwd: DIST_PACKAGE_ABSOLUTE_PATH });
    const tarballFileName = stdout.toString().trim();

    let zipStream = gulp.src(path.join(DIST_PACKAGE_PATH, tarballFileName))
        .pipe(gulp.dest(DIST_PATH));

    gulp.src(DIST_PACKAGE_PATH, {read: false}).pipe(clean());

    return zipStream;
}

module.exports = (gulp) => {
    gulp.task('package', gulpsync.sync([
        'package:clean:dist',
        'package:create'
    ]));
    gulp.task('package:create', gulpsync.sync([
        'package:src:copy',
        'package:src:modify',
        'package:zip'
    ]));

    gulp.task('package:clean:dist', cleanDist);
    gulp.task('package:src:copy', copyPackageSrcFiles);
    gulp.task('package:src:modify:packagejson', modifyPackageJson);
    gulp.task('package:src:modify:doc', modifyDocumentation);
    gulp.task('package:src:modify', gulpsync.async([
        'package:src:modify:packagejson', 'package:src:modify:doc'
    ]));
    gulp.task('package:zip', zipPackage);
};

const excludeFolder = (folder) => {
    return [`!${folder}`, `!${folder}/**`];
};

const excludeFolders = (...folders) => folders.reduce(
    (agg, folder) => agg.concat(excludeFolder(folder)), []
);
