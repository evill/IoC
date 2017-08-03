'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _simple = require('./simple.resource');

Object.defineProperty(exports, 'SimpleResource', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_simple).default;
  }
});

var _function = require('./function.resource');

Object.defineProperty(exports, 'FunctionResource', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_function).default;
  }
});

var _class = require('./class.resource');

Object.defineProperty(exports, 'ClassResource', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_class).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }