"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _simple = require('./resources/simple.resource');

var _simple2 = _interopRequireDefault(_simple);

var _function = require('./resources/function.resource');

var _function2 = _interopRequireDefault(_function);

var _class = require('./resources/class.resource');

var _class2 = _interopRequireDefault(_class);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A number, or a string containing a number.
 * @typedef {Object} CallableResourceSettings
 *
 * @property {boolean} [singleton=false] - Defines that resolving of function or class resources will stored on first
 *                                          call and the same result will be returned on all next calls for resolve this
 *                                          resource. This setting is usefult to prevent implement logic of singleton
 *                                          classes and function with cached results inside resources - this
 *                                          responsibility takes IoC Container.
 */

/**
 * Class IoCContainer provides functionality of inversion
 * of control container.
 * @class
 * @implements {ParentContainerInterface}
 */
var IoCContainer = function () {
    /**
     * Creates instance of IoCContainer
     *
     * @param {Object} [settings]
     * @param {ParentContainer} [settings.parent=null] Will be used for resolve resources in case if they
     *                                                              are absent in current instance
     * @param {Boolean} [settings.parentExplicit=true] Defines that method resolve will search for resource in parent
     *                                                  in case if it not found in child. In case if passed false parent
     *                                                  will be used only for internal mechanism for resolve resources
     *                                                  dependencies
     */
    function IoCContainer() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            parent = _ref.parent,
            parentExplicit = _ref.parentExplicit;

        _classCallCheck(this, IoCContainer);

        /**
         * Contains parent ioc container which will be used for finding not resolved dependencies
         *
         * @type {IoCContainer|Null}
         * @private
         */
        this._parent = parent || null;
        /**
         * Defines ability to resolve resource from parent
         * If set to TRUE resolving of resources from current container will search them in parent container if resource
         * didn't found in current container.
         * If set to FALSE parent container will be used only for resolve dependencies for resources in current container.
         *
         * @type {boolean}
         * @private
         */
        this._parentExplicit = resolveExplicit(parentExplicit);
        /**
         * List of registered resources
         *
         * @type {Map}
         * @private
         */
        this._resources = new Map();
    }

    /**
     * Returns registered resource
     * If dependency mot registered will be returned Null.
     *
     * @public
     *
     * @param  {String} name Name of resource
     * 
     * @return {*}
     */


    _createClass(IoCContainer, [{
        key: 'resolve',
        value: function resolve(name) {
            if (this.hasOwn(name)) {
                return this._resources.get(name).resolve();
            } else if (this._parentExplicit) {
                return this._resolveFromParent(name);
            }

            return null;
        }
        /**
         * Cheks is dependencies registered in manager
         *
         * @public
         *
         * @param  {String} name Name of resource
         * @return {Boolean}
         */

    }, {
        key: 'has',
        value: function has(name) {
            return this.hasOwn(name) || this._parentExplicit && this._hasInParent(name);
        }
    }, {
        key: 'hasOwn',
        value: function hasOwn(name) {
            return this._resources.has(name);
        }
    }, {
        key: '_hasInParent',
        value: function _hasInParent(name) {
            return this._parent && this._parent.has(name);
        }
        /**
         * Resolves resource from parent containers
         * Uses in for resources instances
         *
         * @private
         *
         * @param {String} name
         *
         * @return {SimpleResource|Null} Resolved dependency resource
         */

    }, {
        key: '_resolveFromParent',
        value: function _resolveFromParent(name) {
            return this._hasInParent(name) ? this._parent.resolve(name) : null;
        }
        /**
         * Register new resource
         * @public
         * @param  {*} member
         * @param  {String} name Name of resource
         *
         * @return {IoCContainer}
         */

    }, {
        key: 'register',
        value: function register(member, name) {
            var resource = new _simple2.default(member);

            this._registerResource(name, resource);

            return this;
        }
        /**
         * Register new factory function.
         * For resolving current resource will be executed passed function.
         * @public
         * @param  {Function} member Factory function
         * @param  {String} [name=member.name] Name of resource
         * @param  {CallableResourceSettings} [settings]
         *
         * @return {IoCContainer}
         */

    }, {
        key: 'registerFunc',
        value: function registerFunc(member) {
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : member.name;
            var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var resource = new _function2.default(member, this._resolveResourceDependency.bind(this, name));

            this._registerCallable(name, resource, settings);

            return this;
        }
        /**
         * Register new class factory.
         * For resolving current resource will be created instance of passed constructor.
         * @public
         * @param  {Function} member Constructor for creation new objects
         * @param  {String} [name=member.name] Name of resource
         * @param  {CallableResourceSettings} [settings]
         *
         * @return {IoCContainer}
         */

    }, {
        key: 'registerClass',
        value: function registerClass(member) {
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : member.name;
            var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var resource = new _class2.default(member, this._resolveResourceDependency.bind(this, name));

            this._registerCallable(name, resource, settings);

            return this;
        }
    }, {
        key: '_registerCallable',
        value: function _registerCallable(name, resource, _ref2) {
            var singleton = _ref2.singleton;

            if (singleton) {
                resource.singleton();
            }

            this._registerResource(name, resource);
        }
    }, {
        key: '_registerResource',
        value: function _registerResource(name, resource) {
            this._throwIfRegistered(name);
            this._resources.set(name, resource);
        }
    }, {
        key: '_resolveResourceDependency',
        value: function _resolveResourceDependency(resourceName, dependencyName) {
            if (!this.hasOwn(dependencyName) && !this._hasInParent(dependencyName)) {
                throw new ReferenceError('Dependency for resource with name \'' + resourceName + '\' with name \'' + dependencyName + '\' missed in parent');
            }

            if (this.hasOwn(dependencyName)) {
                return this._resources.get(dependencyName).resolve();
            }

            return this._resolveFromParent(dependencyName);
        }
    }, {
        key: '_throwIfRegistered',
        value: function _throwIfRegistered(name) {
            if (this.hasOwn(name)) {
                throw new Error('Resource with name \'' + name + '\' already registered in container!');
            }
        }
        /**
         * Creates new child container and set current container as parent
         *
         * @return {IoCContainer}
         */

    }, {
        key: 'createChild',
        value: function createChild() {
            var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                explicit = _ref3.explicit;

            return new this.constructor({
                parent: this,
                parentExplicit: resolveExplicit(explicit)
            });
        }
    }]);

    return IoCContainer;
}();

exports.default = IoCContainer;


function resolveExplicit(val) {
    var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return typeof val === 'boolean' ? val : def;
}