/**
 * Registrar function can be used in IoCContainer.register for register factories and classes to provide single point
 * of resource registration
 *
 * @typedef {Function} IoCRegistrar
 *
 * @property {Function} origin - Callable resource constructor of function
 * @property {boolean} [isRegistrar=true] - Used for define that IoCRegistrar function is registrar
 * @property {Function} asSingleton - Call of this method marks resource as singleton when it will be stored in
 *                                      IoC Container
 */

/**
 * Creates registrar bound concrete method which registers resource in ioc container
 *
 * @param {Function} register Function which performs registration of ioc in container.
 *                            IoC container and standard parameters for registration will be passed as function
 *                            arguments to this function when container will register resource registrar
 *
 * @return {Function} Call of returned function will create IoCRegistrar
 */
let createRegistrar = (register) => (resource, settings = {}) => {
    let registrarResource = (ioc, name) => register(ioc, name, resource, settings);

    /**
     * Holds origin resource
     * @type {Function}
     */
    registrarResource.origin = resource;
    /**
     * Property allow to check that function is registrar
     * @type {boolean}
     */
    registrarResource.isRegistrar = true;
    /**
     * Call of this method mark registrar resource as singleton
     * @returns {function(): *} Registrar function
     */
    registrarResource.asSingleton = () => {
        settings.singleton = true;
        return registrarResource;
    };
    /**
     * Allows to define override list resource dependencies
     * @returns {function(): *} Registrar function
     */
    registrarResource.withDependencies = (...args) => {
        settings.dependencies = args;
        return registrarResource;
    };

    return registrarResource;
};

/**
 * Creates registrars for class so class can be registered in container using method IoCContainer.register
 *
 * @function
 *
 * @param {Function} resource - Class
 * @param {CallableResourceSettings} settings
 *
 * @return {IoCRegistrar}
 */
export let iocClass = createRegistrar((ioc, name, resource, settings) => ioc.registerClass(name, resource, settings));

/**
 * Creates registrars for class so class can be registered in container using method IoCContainer.register
 *
 * @function
 * 
 * @param {Function} resource - Class
 * @param {CallableResourceSettings} settings
 *
 * @return {IoCRegistrar}
 */
export let iocFactory = createRegistrar((ioc, name, resource, settings) => ioc.registerFactory(name, resource, settings));

