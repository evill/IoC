/**
 * Represent any data which can be stored in container without dependencies and resolved as is
 */
export default class SimpleResource {
    /**
     * Constructor
     *
     * @param {*} resource
     */
    constructor(resource) {
        this._resource = resource;
    }

    resolve() {
        return this._resource;
    }
}
