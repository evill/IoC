import { IocDependency } from './ioc-dependency';

export class RequiredDependencies extends IocDependency {
    isRequired() {
        return true;
    }

    isOptional() {
        return false;
    }
}

export let iocRequired = (name) => new RequiredDependencies(name);
