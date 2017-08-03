'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _simple = require('./simple.resource');

var _simple2 = _interopRequireDefault(_simple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class FunctionResource provides functionality of IoC resource where resource will be resolved via calling of factory
 * function
 */
var FunctionResource = function (_Recource) {
    _inherits(FunctionResource, _Recource);

    /**
     * @param {Function} resource - function, which should build and return resource
     * @param {Function} resolveDependency Function which resolve dependencies
     */
    function FunctionResource(resource, resolveDependency) {
        _classCallCheck(this, FunctionResource);

        var _this = _possibleConstructorReturn(this, (FunctionResource.__proto__ || Object.getPrototypeOf(FunctionResource)).call(this, resource));

        if (typeof resource !== 'function') {
            throw new TypeError('Callable resource must be a function!');
        }

        if (typeof resolveDependency !== 'function') {
            throw new TypeError('Function for resolving dependencies has bad type!');
        }

        _this._resolveDependency = resolveDependency;
        _this._signleton = false;
        _this._cache = null;
        /**
         * List of dependencies which required for passed resource.
         * They will be passed as list of resource arguments.
         * @type {String[]}
         * @private
         */
        _this._dependencies = Array.isArray(resource.$inject) ? resource.$inject : [];
        return _this;
    }

    /**
     * Mark resource singleton
     * @public
     * @return {FunctionResource}
     */


    _createClass(FunctionResource, [{
        key: 'singleton',
        value: function singleton() {
            this._signleton = true;

            return this;
        }
    }, {
        key: 'isSingleton',
        value: function isSingleton() {
            return this._signleton;
        }
    }, {
        key: 'resolve',
        value: function resolve() {
            var resource = this._cache;

            if (!resource || !this._signleton) {
                var dependencies = this._resolveDependencies();
                var args = Array.prototype.slice.call(arguments, 1);

                resource = this._call(dependencies.concat(args));

                if (this.isSingleton()) {
                    this._cache = resource;
                }
            }

            return resource;
        }

        /**
         * Resolve resource dependencies
         *
         * @return {Array}
         * @private
         */

    }, {
        key: '_resolveDependencies',
        value: function _resolveDependencies() {
            return this._dependencies.map(this._resolveDependency);
        }

        /**IocClass
         * Call factory function with dependencies and additional arguments passing
         *
         * @param {Array} args
         * @return {*}
         * @private
         */

    }, {
        key: '_call',
        value: function _call(args) {
            return this._resource.apply(null, args);
        }
    }]);

    return FunctionResource;
}(_simple2.default);

exports.default = FunctionResource;