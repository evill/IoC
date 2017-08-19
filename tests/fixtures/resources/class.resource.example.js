import { SIMPLE_RESOURCE_NAME } from './simple.resource.example';
import { FUNCTION_RESOURCE_NAME } from './function.resource.example';

export default class ClassResourceExample {
    static $inject = [SIMPLE_RESOURCE_NAME, FUNCTION_RESOURCE_NAME];

    constructor(config, modifier) {
        this.config = config;
        this.modifier = modifier;
    }
    compute(target) {
        return this.config.increment + this.modifier(target);
    }
}

export const CLASS_RESOURCE_NAME = 'increment';
