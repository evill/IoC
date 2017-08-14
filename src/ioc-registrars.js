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
 * @param {Function} register
 *
 * @return {Function} Call of returned function will create IoCRegistrar
 */
let createRegistrar = (register) => (resource, settings = {}) => {
    let registrarResource = (ioc, name) => register(ioc, name, resource, settings);

    registrarResource.origin = resource;
    registrarResource.isRegistrar = true;
    registrarResource.asSingleton = () => {
        settings.singleton = true;
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

