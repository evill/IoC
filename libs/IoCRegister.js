/**
 * Class IoCRegister provides functionality of inversion
 * of control container. It provides
 * 
 * @constructor
 * 
 * @param {Set(IoCRegister)} [parentsSet=Null]
 */
var IoCRegister = function IoCRegister (parentsSet) {
    /**
     * Contains set of parent ioc managers which will be used for
     * finding not resolved dependencies
     * 
     * @type {Set(IoCRegister)|Null}
     * @private
     */
    this._parentsSet = parentsSet || null;
};

IoCRegister.prototype = {
    constructor: IoCRegister,
    /**
     * Returns registered resource
     * @public
     * @param  {String} name Name of resource
     * @return {Any}
     */
    resolve: function (name) {

    },
    /**
     * Cheks is dependencies registered in manager
     * @public
     * @param  {String} name Name of resource
     * @return {Boolean}
     */
    exists: function (name : String) {

    },
    /**
     * Register new resource
     * @public
     * @param  {String} name Name of resource
     * @param  {Any} resource
     * @return {IoCResource}
     */
    register: function (name, resource) {

    },
    /**
     * Register new factory function.
     * For resolving current resource will be executed passed function.
     * @public
     * @param  {String} name Name of resource
     * @param  {Function} resource Factory function
     * @param  {Set(IoCResource)} dependencies
     * List of dependencies which required for passed factory function.
     * They will be passed as list of function arguments.
     * @return {IoCCallable}
     */
    registerCallable: function (name, resource, dependencies) {

    },
    /**
     * Register new class factory.
     * For resolving current resource will be created instance of passed constructor.
     * @public
     * @param  {String} name Name of resource
     * @param  {Function} resource Constructor for creation new objects
     * @param  {Set(IoCResource)} dependencies
     * List of dependencies which required for passed counstructor.
     * They will be passed as list of constructor arguments.
     * @return {IoCClass}
     */
    registerClass: function (name, resource, dependencies) {

    },
};


module.exports = IoCRegister;