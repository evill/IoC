/**
 * Class IoCAggregator provided ability to aggregate several IoC container for resolve resource from them
 * 
 * Common use cases are:
 * - transparent resolving of resources from several IoC Containers using one entry point
 * - using several IoC containers as parent for target IoC container
 */
export default class IoCAggregator {
    /**
     * @param {IoCAggregator[]|IoCContainer[]} containers
     */
    constructor(containers) {
        if (!Array.isArray(containers)) {
            throw new TypeError(`Bad containers type - should be an Array!`);
        }

        containers.forEach((container, index) => {
            if (
                !container ||
                (typeof(container) !== 'object') ||
                (typeof(container.resolve) !== 'function') ||
                (typeof(container.has) !== 'function')
            ) {
                throw new TypeError(`Bad type of dependency #${index + 1} - should implement IoCResolver interface!`);
            }
        });

        this._containers = containers;
    }
    /**
     * Resolves resource from containers which holds
     * Resolving will be performed in order which containers were passed. Will be returned first found resource.
     *
     * @param {String} name SimpleResource name
     *
     * @return {SimpleResource|Null} Resolved dependency resource
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
     * @param {IoCAggregator[]|IoCContainer[]} [containers=[]] Extends list of parent container for new aggregator
     * 
     * @returns {IoCAggregator}
     */
    createChild(containers = []) {
        let fullListOfContainers = Array.from(containers);
        fullListOfContainers.unshift(this);
        return new IoCAggregator(fullListOfContainers);
    }
}
