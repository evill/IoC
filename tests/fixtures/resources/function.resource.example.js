import { SIMPLE_RESOURCE_NAME } from './simple.resource.example';

let functionResourceExample = (config) => (target) => target * config.multiplier;

functionResourceExample.$inject = [SIMPLE_RESOURCE_NAME];

export default functionResourceExample;

export const FUNCTION_RESOURCE_NAME = 'modifier';
