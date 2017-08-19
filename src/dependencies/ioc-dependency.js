/**
 * Describes abstract class dependency
 * @abstract
 */
export class IocDependency {
    /**
     * @param {String} name - Name of dependency
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Should checks is dependency required
     * 
     * @abstract
     * 
     * @return {Boolean} TRUE if dependency required
     */
    isRequired() {
        throw new Error(`Method 'isRequired' is not overridden in class ${this.constructor.name}!`);
    }
    /**
     * Should checks is dependency optional
     * 
     * @abstract
     *
     * @return {Boolean} TRUE if dependency optional
     */
    isOptional() {
        throw new Error(`Method 'isOptional' is not overridden in class ${this.constructor.name}!`);
    }

    toString() {
        return `${this.constructor.name}(${this.name})`;
    }

    valueOf() {
        return this.name;
    }
}

/**
 * Checks that passed parameter is instance of IoCDependency
 * 
 * @param {IocDependency|*} dependency
 * 
 * @return {Boolean}
 */
export let instanceOfDependency = (dependency) => dependency instanceof IocDependency; 
