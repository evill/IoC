'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _function = require('./function.resource');

var _function2 = _interopRequireDefault(_function);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Provides functionality of IoC resource where resource is constructor
 * which should be instantiated on resolving
 */
var ClassResource = function (_CallableResource) {
    _inherits(ClassResource, _CallableResource);

    function ClassResource() {
        _classCallCheck(this, ClassResource);

        return _possibleConstructorReturn(this, (ClassResource.__proto__ || Object.getPrototypeOf(ClassResource)).apply(this, arguments));
    }

    _createClass(ClassResource, [{
        key: '_call',

        /**
         * Call constructor/class with dependencies and additional arguments passing
         *
         * @param {Array} args
         * @return {*}
         * @private
         */
        value: function _call(args) {
            var IocConstructor = Function.prototype.bind.apply(this._resource, [{}].concat(args));

            return new IocConstructor();
        }
    }]);

    return ClassResource;
}(_function2.default);

exports.default = ClassResource;