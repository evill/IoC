import Resource from './simple.resource';

/**
 * Class FactoryResource provides functionality of IoC resource where resource will be resolved via calling of factory
 * function
 */
export default class FactoryResource extends Resource {
    /**
     * @param {Function} resource - factory, which should build and return resource
     * @param {Function} resolveDependency Function which resolve dependencies
     */
    constructor(resource, resolveDependency) {
        super(resource);

        if (typeof resource !== 'function') {
            throw new TypeError('Resource must be a function!');
        }

        if (typeof(resolveDependency) !== 'function') {
            throw new TypeError('Function for resolving dependencies has bad type!');
        }

        this._resolveDependency = resolveDependency;
        this._signleton = false;
        this._cache = null;
        /**
         * List of dependencies which required for passed resource.
         * They will be passed as list of resource arguments.
         * @type {String[]}
         * @private
         */
        this._dependencies  = Array.isArray(resource.$inject) ? Array.from(resource.$inject) : [];
    }


    /**
     * Mark resource singleton
     * 
     * This mean that the first result of resolving current resource will be stored in cache and used as result for all
     * future calls of method resolve.
     * 
     * @public
     * @return {FactoryResource}
     */
    singleton() {
        this._signleton = true;

        return this;
    }
    
    isSingleton() {
        return this._signleton;
    }

    resolve() {
        let resource = this._cache;

        if (!resource || !this._signleton) {
            const dependencies = this._resolveDependencies();
            const args = Array.prototype.slice.call(arguments, 1);

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
    _resolveDependencies() {
        return this._dependencies.map(this._resolveDependency);
    }

    /**
     * Call factory function with dependencies and additional arguments passing
     *
     * @param {Array} args
     * @return {*}
     * @private
     */
    _call(args) {
        return this._resource.apply(null, args);
    }
}

