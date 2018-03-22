const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const DIST_PATH = 'dist';
const DIST_ABSOLUTE_PATH = path.join(PROJECT_ROOT, DIST_PATH);

const DIST_PACKAGE_PATH = path.join(DIST_PATH, 'package');
const DIST_PACKAGE_ABSOLUTE_PATH = path.join(PROJECT_ROOT, DIST_PACKAGE_PATH);


const LIB_PATH = 'lib';

const SRC_PATH = 'src';

exports.PROJECT_ROOT = PROJECT_ROOT;

exports.DIST_PATH = DIST_PATH;
exports.DIST_ABSOLUTE_PATH = DIST_ABSOLUTE_PATH;

exports.DIST_PACKAGE_PATH = DIST_PACKAGE_PATH;
exports.DIST_PACKAGE_ABSOLUTE_PATH = DIST_PACKAGE_ABSOLUTE_PATH;

exports.LIB_PATH = LIB_PATH;

exports.SRC_PATH = SRC_PATH;
