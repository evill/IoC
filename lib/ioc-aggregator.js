'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parentContainer = require('./parent-container.interface');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class IoCAggregator provided ability to aggregate several IoC container for resolve resource from them
 * 
 * Common use cases are:
 * - transparent resolving of resources from several IoC Containers using one entry point
 * - using several IoC containers as parent for target IoC container
 *
 * @class
 * @implements {ParentContainerInterface}
 */
var IoCAggregator = function () {
    /**
     * @param {ParentContainerInterface[]} [containers=[]]
     */
    function IoCAggregator() {
        var _this = this;

        var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, IoCAggregator);

        if (!Array.isArray(containers)) {
            throw new TypeError('Bad containers type - should be an Array!');
        }

        containers.forEach(function (container, index) {
            return _this.validateContainerInterface;
        });

        this._containers = containers;
    }

    /**
     * Register new member in aggregator
     *
     * @param {ParentContainerInterface} container
     *
     * @return {IoCAggregator}
     */


    _createClass(IoCAggregator, [{
        key: 'registerContainer',
        value: function registerContainer(container) {
            this.validateContainerInterface(container);

            this._containers.push(container);

            return this;
        }

        /**
         * Validates that passed container satisfies appropriate interface of parent
         *
         * @param {ParentContainerInterface} container
         *
         * @throws {TypeError} If container doesn't implement ParentContainer interface
         */

    }, {
        key: 'validateContainerInterface',
        value: function validateContainerInterface(container) {
            if (!(0, _parentContainer.validateContainerInterface)(container)) {
                throw new TypeError('Bad type of dependency #' + (index + 1) + ' - should implement IoCResolver interface!');
            }
        }
        /**
         * Resolves resource from containers which holds
         * Resolving will be performed in order which containers were passed. Will be returned first found resource.
         *
         * @param {String} name SimpleResource name
         *
         * @return {*} Resolved dependency resource
         */

    }, {
        key: 'resolve',
        value: function resolve(name) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._containers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var container = _step.value;

                    if (container.has(name)) {
                        return container.resolve(name);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return null;
        }

        /**
         * Checks that resource exists in aggregator
         * @param {String} name
         * @returns {boolean}
         */

    }, {
        key: 'has',
        value: function has(name) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._containers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var container = _step2.value;

                    if (container.has(name)) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return false;
        }

        /**
         * Creates new instance of IoC Aggregator and pass itself to list of containers
         * 
         * @param {ParentContainerInterface[]} [containers=[]] Extends list of parent container for new aggregator
         * 
         * @returns {IoCAggregator}
         */

    }, {
        key: 'createChild',
        value: function createChild() {
            var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var fullListOfContainers = Array.from(containers);
            fullListOfContainers.unshift(this);
            return new IoCAggregator(fullListOfContainers);
        }
    }]);

    return IoCAggregator;
}();

exports.default = IoCAggregator;