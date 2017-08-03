import FunctionResource from '../../../src/resources/function.resource';
import functionResourceExample from '../../fixtures/resources/function.resource.example';
import { notFunctions } from '../../fixtures/resources/not-a-function.resource';
import { dependencyResolverStub } from '../../fixtures/resolve-dependecies.mock';

describe('FunctionResource class', function () {
    describe('constructor', function () {

        it('should create new instance of FunctionResource', function () {
            var resource = new FunctionResource(functionResourceExample, dependencyResolverStub);

            expect(resource).to.be.an.instanceof(FunctionResource);
        });

        it('should accept only function as resource', function () {
            let create = (origin) => () => new FunctionResource(origin, dependencyResolverStub);
            
            expect(create(functionResourceExample), 'fails for function resource type').to.not.throw();

            for (let resource of notFunctions) {
                expect(create(resource), `not fails for ${typeof(resource)} type`).to.throw(TypeError);
            }
            
        });

        it('should accept only function as dependency resolver', function () {
            let resolveDependency = (resolver) => () => new FunctionResource(functionResourceExample, resolver);

            expect(resolveDependency(dependencyResolverStub), 'fails for function dependency resolver type').to.not.throw();

            for (let resource of notFunctions) {
                expect(resolveDependency(resource), `not fails for ${typeof(resource)} type`).to.throw(TypeError);
            }

        });
    });
});
