import ClassResource from '../../../lib/resources/class.resource';
import ClassResourceExample from '../../fixtures/resources/class.resource.example';
import { notFunctions } from '../../fixtures/resources/not-a-function.resource';
import { dependencyResolverStub } from '../../fixtures/resolve-dependecies.mock';

describe('ClassResource class', function () {
    describe('constructor', function () {
        it('should create new instance of ClassResource', function () {
            var resource = new ClassResource(ClassResourceExample, dependencyResolverStub);

            expect(resource).to.be.an.instanceof(ClassResource);
        });

        it('should accept only constructor function as resource', function () {
            let create = (origin) => () => new ClassResource(origin, dependencyResolverStub);

            expect(create(ClassResourceExample), 'fails for constructor function resource type').to.not.throw();

            for (let resource of notFunctions) {
                expect(create(resource), `not fails for ${typeof(resource)} type`).to.throw(TypeError);
            }
        });
    });
});
