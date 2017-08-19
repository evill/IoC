import { IocDependency } from './ioc-dependency';

/**
 * Class represent optional dependency
 *
 * Optional dependency is dependency which will not cause exception if appropriate resource is not registered in
 * container. Instead of this target Callable resource will take default value Null instead of absent dependency.
 * Default value can be changed with api of this class so instead of null you can specify any value for missed
 * dependency. This behaviour is very similar to default values of function parameters.
 */
export class OptionalDependency extends IocDependency {

    constructor(...args) {
        super(...args);
        this._default = null;
    }

    isRequired() {
        return false;
    }

    isOptional() {
        return true;
    }

    /**
     * Provides ability to override default value which will passed to target resources in case if dependency was not
     * resolved from container
     * 
     * Overrides default null
     *
     * @param value
     *
     * @return {OptionalDependency}
     */
    withDefault(value) {
        this._default = value;
        return this;
    }

    /**
     * Returns value of dependency resource which should be used in case if dependency wasn't found in container
     *
     * @returns {null|*}
     */
    asDefault() {
        return this._default;
    }
}

export let iocOptional = (name) => new OptionalDependency(name);
