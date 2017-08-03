/**
 * Defines public interface of entities which can be used as parent container
 *
 * @interface ParentContainerInterface
 */

/**
 * Resolves resources from container
 *
 * @method
 * @name ParentContainerInterface#resolve
 *
 * @param {String} name - SimpleResource name
 *
 * @return {*} - Resolved dependency resource
 */

/**
 * Checks that resource exists in container
 *
 * @method
 * @name ParentContainerInterface#has
 *
 * @param {String} name
 * @returns {boolean}
 */


/**
 * Validate interface of parent container
 * 
 * @param {ParentContainerInterface} container
 * 
 * @return {Boolean}
 */
export function validateContainerInterface(container) {
    return !(
        !container ||
        (typeof(container) !== 'object') ||
        (typeof(container.resolve) !== 'function') ||
        (typeof(container.has) !== 'function')
    );
}
