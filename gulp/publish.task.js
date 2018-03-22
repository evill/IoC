const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const { execSync } = require('child_process');
const packageJson = require('../package.json');

const { PROJECT_ROOT, DIST_ABSOLUTE_PATH } = require('./gulp.constants');

const npmPublish = (tag) => (done) => {
    if (!tag) {
        const tagIndex = process.argv.indexOf('--tag');

        if (tagIndex === -1) {
            throw new TypeError('Tag should be specified!');
        }

        tag = process.argv[tagIndex + 1];

        if (typeof(tag) !== 'string') {
            throw new TypeError('Tag argument should be string!');
        }

        if (TAGS_LIST.indexOf(tag) === -1 ) {
            throw new TypeError(`Unknown tag value! Tag can be one from follow: ${TAG_LATEST}.`);
        }
    }

    const tarbalFilePath = path.resolve(DIST_ABSOLUTE_PATH, `${packageJson.name}-${packageJson.version}.tgz`);

    try {
        execSync(`npm publish ${tarbalFilePath} --tag ${tag}`, { cwd: PROJECT_ROOT });
        done();
    } catch(err) {
        done(err);
    }
};

const TAG_LATEST = 'latest';
const TAG_DEV = 'dev';
const TAG_STABLE = 'stable';
const TAG_BETA = 'beta';
const TAG_CANARY = 'canary';

const TAGS_LIST = [
    TAG_LATEST,
    TAG_DEV,
    TAG_STABLE,
    TAG_BETA,
    TAG_CANARY
];

module.exports = (gulp) => {
    gulp.task('publish', npmPublish());
};
