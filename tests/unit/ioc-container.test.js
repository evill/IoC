import IoCContainer from '../../src/ioc-container';
import { simpleResourceExample, functionResourceExample, ClassResourceExample } from '../fixtures/resources';

const SIMPLE_RESOURCE_NAME = 'config';
const FUNCTION_RESOURCE_NAME = 'modifier';
const CLASS_RESOURCE_NAME = 'increment';

describe('IoCContainer class', function () {
    describe('Constructor', function () {
        it('should create new instance of IoCContainer', function () {
            var ioc = new IoCContainer();

            expect(ioc).to.be.an.instanceof(IoCContainer);
        });
    });

    describe('for resource with type', function () {
        
        beforeEach(function () {
            this.ioc = new IoCContainer();
        });
        
        afterEach(function () {
            delete this.ioc;
        });

        describe('Simple', function () {

            beforeEach(function () {
                this.ioc.register(simpleResourceExample, SIMPLE_RESOURCE_NAME);
            });

            it('should allow to register it', function () {
                expect(this.ioc.has(SIMPLE_RESOURCE_NAME)).to.be.true;
            });

            it('should allow to resolve it', function () {
                let simpleResourceValue = this.ioc.resolve(SIMPLE_RESOURCE_NAME);

                expect(simpleResourceValue).to.equal(simpleResourceExample);
            });
        });

        describe('Function', function () {

            beforeEach(function () {
                this.ioc.register(simpleResourceExample, SIMPLE_RESOURCE_NAME);
                this.ioc.registerFunc(functionResourceExample, FUNCTION_RESOURCE_NAME);
            });

            it('should allow to register it', function () {
                expect(this.ioc.has(FUNCTION_RESOURCE_NAME)).to.be.true;
            });

            it('should allow to resolve result of it invocation and pass all dependencies', function () {
                let simpleResourceValue = this.ioc.resolve(SIMPLE_RESOURCE_NAME);
                let funcResourceValue = this.ioc.resolve(FUNCTION_RESOURCE_NAME);

                expect(funcResourceValue(5)).to.equal(functionResourceExample(simpleResourceValue)(5));
            });

            it('should not cache result of first resolving for not singleton', function () {
                let result1 = this.ioc.resolve(FUNCTION_RESOURCE_NAME);
                let result2 = this.ioc.resolve(FUNCTION_RESOURCE_NAME);

                expect(result2).to.not.equal(result1);
            });

            it('should cache result of first resolving for singleton', function () {
                this.ioc.registerFunc(functionResourceExample, 'singleton_func', { singleton: true });

                let result1 = this.ioc.resolve('singleton_func');
                let result2 = this.ioc.resolve('singleton_func');

                expect(result2).to.equal(result1);
            });
        });

        describe('Class', function () {

            beforeEach(function () {
                this.ioc.register(simpleResourceExample, SIMPLE_RESOURCE_NAME);
                this.ioc.registerFunc(functionResourceExample, FUNCTION_RESOURCE_NAME);
                this.ioc.registerClass(ClassResourceExample, CLASS_RESOURCE_NAME);
            });

            it('should allow to register it', function () {
                expect(this.ioc.has(CLASS_RESOURCE_NAME)).to.be.true;
            });

            it('should allow to resolve instance', function () {
                let classResourceValue = this.ioc.resolve(CLASS_RESOURCE_NAME);

                expect(classResourceValue).to.be.an.instanceof(ClassResourceExample);
            });

            it('should pass defined dependencies', function () {
                let simpleResourceValue = this.ioc.resolve(SIMPLE_RESOURCE_NAME);
                let funcResourceValue = this.ioc.resolve(FUNCTION_RESOURCE_NAME);
                let classResourceValue = this.ioc.resolve(CLASS_RESOURCE_NAME);

                expect(classResourceValue.config).to.equal(simpleResourceValue);
                expect(classResourceValue.modifier(5)).to.equal(funcResourceValue(5));
            });

            it('should not cache result of first resolving for not singleton', function () {
                let result1 = this.ioc.resolve(CLASS_RESOURCE_NAME);
                let result2 = this.ioc.resolve(CLASS_RESOURCE_NAME);

                expect(result2).to.not.equal(result1);
            });

            it('should cache result of first resolving for singleton', function () {
                this.ioc.registerClass(ClassResourceExample, 'singleton_class', { singleton: true });

                let result1 = this.ioc.resolve('singleton_class');
                let result2 = this.ioc.resolve('singleton_class');

                expect(result2).to.equal(result1);
            });
        });

        describe('Class or Function', function () {
            it('should throw error in case if any dependency is absent on resolving function result', function () {
                this.ioc.registerFunc(functionResourceExample, FUNCTION_RESOURCE_NAME);

                let resolve = () => this.ioc.resolve(FUNCTION_RESOURCE_NAME);

                expect(resolve, 'didn\'t throw error for missed dependencies').to.throw(ReferenceError);
            });

            it('should throw error in case if any dependency is absent on resolving class instance', function () {
                this.ioc.registerClass(ClassResourceExample, CLASS_RESOURCE_NAME);

                let resolve = () => this.ioc.resolve(CLASS_RESOURCE_NAME);

                expect(resolve, 'didn\'t throw error for missed dependencies').to.throw(ReferenceError);
            });
        });

        describe('Simple, Function or Class', function () {

            it('should return null when trying to resolve non-registered resource', function () {
                const result = this.ioc.resolve('non-registered_resource');

                expect(result).to.be.null;
            });
        });
    });

    describe('created as child from parent container', function () {

        before(function () {
            this.computeTarget = 5;

            this.computeReference = (new ClassResourceExample(
                simpleResourceExample,
                functionResourceExample(simpleResourceExample)
            )).compute(this.computeTarget);
        });

        after(function () {
            delete this.computeTarget;
            delete this.computeReference;
        });

        beforeEach(function () {
            this.parentIoc = new IoCContainer();

            this.parentIoc.register(simpleResourceExample, SIMPLE_RESOURCE_NAME);
            this.parentIoc.registerFunc(functionResourceExample, FUNCTION_RESOURCE_NAME);
        });

        afterEach(function () {
            delete this.parentIoc;
        });

        describe('with explicit setting TRUE', function () {
            beforeEach(function () {
                this.childIoc = this.parentIoc.createChild({explicit: true});

                this.childIoc.registerClass(ClassResourceExample, CLASS_RESOURCE_NAME);
            });

            afterEach(function () {
                delete this.childIoc;
            });

            it('should resolve resources from parent transparently', function () {
                let simpleResourceValue = this.childIoc.resolve(SIMPLE_RESOURCE_NAME);
                let funcResourceValue = this.childIoc.resolve(FUNCTION_RESOURCE_NAME);

                expect(simpleResourceValue, 'Simple resource didn\'t resolved from parent').to.equal(simpleResourceExample);
                expect(funcResourceValue(this.computeTarget, 'Func resource didn\'t resolved from parent')).to.equal(
                    functionResourceExample(simpleResourceValue)(this.computeTarget)
                );
            });

            it('should resolve dependencies from parent for registered resource', function () {
                let classResourceValue = this.childIoc.resolve(CLASS_RESOURCE_NAME);

                expect(classResourceValue).to.be.an.instanceof(ClassResourceExample);
                expect(
                    classResourceValue.compute(this.computeTarget),
                    'Resolved resource behaviour are different due to wrong resolving of dependencies'
                ).to.equal(this.computeReference);
            });
        });


        describe('with explicit setting FALSE', function () {

            beforeEach(function () {
                this.childIoc = this.parentIoc.createChild({explicit: false});

                this.childIoc.registerClass(ClassResourceExample, CLASS_RESOURCE_NAME);
            });

            afterEach(function () {
                delete this.childIoc;
            });

            it('should not allow to resolve resources from parent transparently', function () {
                let simpleResourceValue = this.childIoc.resolve(SIMPLE_RESOURCE_NAME);
                let funcResourceValue = this.childIoc.resolve(FUNCTION_RESOURCE_NAME);

                expect(simpleResourceValue).to.be.null;
                expect(funcResourceValue).to.be.null;
            });

            it('should resolve dependencies from parent for registered resource', function () {
                let classResourceValue = this.childIoc.resolve(CLASS_RESOURCE_NAME);

                expect(classResourceValue).to.be.an.instanceof(ClassResourceExample);
                expect(
                    classResourceValue.compute(this.computeTarget),
                    'Resolved resource behaviour are different due to wrong resolving of dependencies'
                ).to.equal(this.computeReference);
            });
        });

        describe('should use right priority to resolve resources from parent', function () {

            beforeEach(function () {
                const ParentClassResource = class {
                    compute() {
                        return false;
                    }
                };

                this.parentIoc.registerClass(ParentClassResource, CLASS_RESOURCE_NAME);
                
                this.childIoc = this.parentIoc.createChild();
                this.childIoc.registerClass(ClassResourceExample, CLASS_RESOURCE_NAME);
            });

            afterEach(function () {
                delete this.childIoc;
            });

            it('should look for own resources and dependencies; and only if not found - in parent', function () {
                let classResourceValue = this.childIoc.resolve(CLASS_RESOURCE_NAME);

                expect(classResourceValue).to.be.an.instanceof(ClassResourceExample);
                expect(
                    classResourceValue.compute(this.computeTarget),
                    'Resolved resource behaviour are different due to wrong resolving of dependencies'
                ).to.equal(this.computeReference);
            });
        });
    });

    // Accepts ioc aggregator
    //   Allows to resolves dependencies
    //   Allows to resolves resources
});
