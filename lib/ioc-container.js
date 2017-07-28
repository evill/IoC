"use strict";

import Resource from './resources/simple.resource';
import FunctionResource from './resources/function.resource';
import ClassResource from './resources/class.resource';

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
 */
class IoCContainer {
    /**
     * Creates instance of IoCContainer
     *
     * @param {Object} [settings]
     * @param {IoCContainer|IoCAggregator} [settings.parent= null] Will be used for resolve resources in case if they
     *                                                              are absent in current instance
     * @param {Boolean} [settings.parentExplicit=true] Defines that method resolve will search for resource in parent
     *                                                  in case if it not found in child. In case if passed false parent
     *                                                  will be used only for internal mechanism for resolve resources
     *                                                  dependencies
     */
    constructor({parent, parentExplicit} = {}) {
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
     * @return {*}
     */
    resolve(name) {
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
    has(name) {
        return this.hasOwn(name) || (this._parentExplicit && this._hasInParent(name));
    }
    hasOwn(name) {
        return this._resources.has(name);
    }
    _hasInParent(name) {
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
    _resolveFromParent(name) {
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
    register(member, name) {
        let resource = new Resource(member);

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
    registerFunc(member, name = member.name, settings = {}) {
        var resource = new FunctionResource(member, this._resolveResourceDependency.bind(this, name));

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
    registerClass(member, name = member.name, settings = {}) {
        var resource = new ClassResource(member, this._resolveResourceDependency.bind(this, name));

        this._registerCallable(name, resource, settings);

        return this;
    }

    _registerCallable(name, resource, { singleton }) {
        if (singleton) {
            resource.singleton();
        }

        this._registerResource(name, resource);
    }

    _registerResource(name, resource) {
        this._throwIfRegistered(name);
        this._resources.set(name, resource);
    }

    _resolveResourceDependency(resourceName, dependencyName) {
        if (!this.hasOwn(dependencyName) && !this._hasInParent(dependencyName)) {
            throw new ReferenceError(`Dependency for resource with name '${resourceName}' with name '${dependencyName}' missed in parent`);
        }
        
        if (this.hasOwn(dependencyName)) {
            return this._resources.get(dependencyName).resolve();
        }

        return this._resolveFromParent(dependencyName);
    }
    _throwIfRegistered(name) {
        if (this.hasOwn(name)) {
            throw new Error(`Resource with name '${name}' already registered in container!`);
        }
    }
    /**
     * Creates new child container and set current container as parent
     *
     * @return {IoCContainer}
     */
    createChild({explicit} = {}) {
        return new this.constructor({
            parent: this,
            parentExplicit: resolveExplicit(explicit)
        });
    }
}

export default IoCContainer;

function resolveExplicit(val, def = true) {
    return typeof(val) === 'boolean' ? val : def;
}

