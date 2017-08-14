import FactoryResource from './factory.resource';

/**
 * Provides functionality of IoC resource where resource is constructor
 * which should be instantiated on resolving
 */
export default class ClassResource extends FactoryResource {
    /**
     * Call constructor/class with dependencies and additional arguments passing
     *
     * @param {Array} args
     * @return {*}
     * @private
     */
    _call(args) {
        const IocConstructor = Function.prototype.bind.apply(
            this._resource,
            [{}].concat(args)
        );

        return new IocConstructor();
    }
}

