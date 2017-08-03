'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iocContainer = require('./ioc-container');

Object.defineProperty(exports, 'IoCContainer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_iocContainer).default;
  }
});

var _iocAggregator = require('./ioc-aggregator');

Object.defineProperty(exports, 'IoCAggregator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_iocAggregator).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }