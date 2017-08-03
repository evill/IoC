import {validateContainerInterface} from './parent-container.interface';

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
export default class IoCAggregator {
    /**
     * @param {ParentContainerInterface[]} [containers=[]]
     */
    constructor(containers = []) {
        if (!Array.isArray(containers)) {
            throw new TypeError(`Bad containers type - should be an Array!`);
        }

        containers.forEach((container, index) => this.validateContainerInterface);

        this._containers = containers;
    }

    /**
     * Register new member in aggregator
     *
     * @param {ParentContainerInterface} container
     *
     * @return {IoCAggregator}
     */
    registerContainer(container) {
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
    validateContainerInterface(container) {
        if (!validateContainerInterface(container)) {
            throw new TypeError(`Bad type of dependency #${index + 1} - should implement IoCResolver interface!`);
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
    resolve(name) {
        for (let container of this._containers) {
            if (container.has(name)) {
                return container.resolve(name);
            }
        }

        return null;
    }

    /**
     * Checks that resource exists in aggregator
     * @param {String} name
     * @returns {boolean}
     */
    has(name) {
        for (let container of this._containers) {
            if (container.has(name)) {
                return true;
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
    createChild(containers = []) {
        let fullListOfContainers = Array.from(containers);
        fullListOfContainers.unshift(this);
        return new IoCAggregator(fullListOfContainers);
    }
}
