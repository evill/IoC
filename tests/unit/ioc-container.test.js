import IoCContainer from '../../src/ioc-container';
import { iocFactory, iocClass } from '../../src/ioc-registrars';
import {
    simpleResourceExample, SIMPLE_RESOURCE_NAME,
    functionResourceExample, FUNCTION_RESOURCE_NAME,
    ClassResourceExample, CLASS_RESOURCE_NAME
} from '../fixtures/resources';

describe('IoCContainer class', function () {

    before(function() {
        let funcResource = functionResourceExample(simpleResourceExample);

        this.target = 5;
        this.funcResultReference = funcResource(this.target);
        this.classResultReference = (new ClassResourceExample(simpleResourceExample, funcResource)).compute(this.target);
    });

    after(function() {
        delete this.target;
        delete this.funcResultReference;
        delete this.classResultReference;
    });

    describe('Constructor', function () {
        it('should create new instance of IoCContainer', function () {
            var ioc = new IoCContainer();

            expect(ioc).to.be.an.instanceof(IoCContainer);
        });
    });

    describe('method registerAll', function() {
        it('should allow to register several resources with any type', function () {
            let ioc = new IoCContainer();

            ioc.registerAll({
                [SIMPLE_RESOURCE_NAME]: simpleResourceExample,
                [FUNCTION_RESOURCE_NAME]: iocFactory(functionResourceExample),
                [CLASS_RESOURCE_NAME]: iocClass(ClassResourceExample)
            });

            let classResourceValue = ioc.resolve(CLASS_RESOURCE_NAME);

            expect(classResourceValue.compute(this.target)).to.equal(this.classResultReference);
        });
    });

    describe('method resolveAll', function() {
        it('should allow to resolve several resources by list of names', function () {
            let ioc = new IoCContainer();

            ioc.registerAll({
                [SIMPLE_RESOURCE_NAME]: simpleResourceExample,
                [FUNCTION_RESOURCE_NAME]: iocFactory(functionResourceExample).asSingleton(),
                [CLASS_RESOURCE_NAME]: iocClass(ClassResourceExample).asSingleton()
            });

            let resourcesValues = ioc.resolveAll([SIMPLE_RESOURCE_NAME, FUNCTION_RESOURCE_NAME, CLASS_RESOURCE_NAME]);

            let resourcesValuesTarget = {
                [SIMPLE_RESOURCE_NAME]: ioc.resolve(SIMPLE_RESOURCE_NAME),
                [FUNCTION_RESOURCE_NAME]: ioc.resolve(FUNCTION_RESOURCE_NAME),
                [CLASS_RESOURCE_NAME]: ioc.resolve(CLASS_RESOURCE_NAME)
            };

            expect(resourcesValues).to.deep.equal(resourcesValuesTarget);
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
                this.ioc.register(SIMPLE_RESOURCE_NAME, simpleResourceExample);
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
                this.ioc.register(SIMPLE_RESOURCE_NAME, simpleResourceExample);
                this.ioc.registerFactory(FUNCTION_RESOURCE_NAME, functionResourceExample);
            });

            it('should allow to register it', function () {
                expect(this.ioc.has(FUNCTION_RESOURCE_NAME)).to.be.true;
            });

            it('should allow to resolve result of it invocation and pass all dependencies', function () {
                let funcResourceValue = this.ioc.resolve(FUNCTION_RESOURCE_NAME);

                expect(funcResourceValue(this.target)).to.equal(this.funcResultReference);
            });

            it('should not cache result of first resolving for not singleton', function () {
                let result1 = this.ioc.resolve(FUNCTION_RESOURCE_NAME);
                let result2 = this.ioc.resolve(FUNCTION_RESOURCE_NAME);

                expect(result2).to.not.equal(result1);
            });

            it('should cache result of first resolving for singleton', function () {
                this.ioc.registerFactory('singleton_func', functionResourceExample, { singleton: true });

                let result1 = this.ioc.resolve('singleton_func');
                let result2 = this.ioc.resolve('singleton_func');

                expect(result2).to.equal(result1);
            });
        });

        describe('Class', function () {

            beforeEach(function () {
                this.ioc.register(SIMPLE_RESOURCE_NAME, simpleResourceExample);
                this.ioc.registerFactory(FUNCTION_RESOURCE_NAME, functionResourceExample);
                this.ioc.registerClass(CLASS_RESOURCE_NAME, ClassResourceExample);
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
                let classResourceValue = this.ioc.resolve(CLASS_RESOURCE_NAME);

                expect(classResourceValue.config).to.equal(simpleResourceValue);
                expect(classResourceValue.modifier(this.target)).to.equal(this.funcResultReference);
            });

            it('should not cache result of first resolving for not singleton', function () {
                let result1 = this.ioc.resolve(CLASS_RESOURCE_NAME);
                let result2 = this.ioc.resolve(CLASS_RESOURCE_NAME);

                expect(result2).to.not.equal(result1);
            });

            it('should cache result of first resolving for singleton', function () {
                this.ioc.registerClass('singleton_class', ClassResourceExample, { singleton: true });

                let result1 = this.ioc.resolve('singleton_class');
                let result2 = this.ioc.resolve('singleton_class');

                expect(result2).to.equal(result1);
            });
        });

        describe('Class or Function', function () {
            it('should throw error in case if any dependency is absent on resolving function result', function () {
                this.ioc.registerFactory(FUNCTION_RESOURCE_NAME, functionResourceExample);

                let resolve = () => this.ioc.resolve(FUNCTION_RESOURCE_NAME);

                expect(resolve, 'didn\'t throw error for missed dependencies').to.throw(ReferenceError);
            });

            it('should throw error in case if any dependency is absent on resolving class instance', function () {
                this.ioc.registerClass(CLASS_RESOURCE_NAME, ClassResourceExample);

                let resolve = () => this.ioc.resolve(CLASS_RESOURCE_NAME);

                expect(resolve, 'didn\'t throw error for missed dependencies').to.throw(ReferenceError);
            });

            it('should be registered as singleton in case if resource property $singleton set to TRUE', function () {
                let SingletonClass = class extends ClassResourceExample {
                    static $singleton = true;
                };

                this.ioc.register(SIMPLE_RESOURCE_NAME, simpleResourceExample);
                this.ioc.registerFactory(FUNCTION_RESOURCE_NAME, functionResourceExample);
                this.ioc.registerClass(CLASS_RESOURCE_NAME, SingletonClass);
                
                let instance1 = this.ioc.resolve(CLASS_RESOURCE_NAME);
                let instance2 = this.ioc.resolve(CLASS_RESOURCE_NAME);

                expect(instance1).to.be.equal(instance2);
            });

            it('should be registered as singleton in case if resource property $singleton set to TRUE', function () {
                let SingletonClass = class extends ClassResourceExample {
                    static $singleton = true;
                };

                this.ioc.register(SIMPLE_RESOURCE_NAME, simpleResourceExample);
                this.ioc.registerFactory(FUNCTION_RESOURCE_NAME, functionResourceExample);
                this.ioc.registerClass(CLASS_RESOURCE_NAME, SingletonClass);

                let instance1 = this.ioc.resolve(CLASS_RESOURCE_NAME);
                let instance2 = this.ioc.resolve(CLASS_RESOURCE_NAME);

                expect(instance1).to.be.equal(instance2);
            });

            it('should allow to override dependencies using method settings parameter', function () {
                let ioc = new IoCContainer();
                
                const anotherConfig = {
                    multiplier: 100,
                    increment: 4
                };

                ioc.register('config2', anotherConfig);
                ioc.registerFactory(
                    FUNCTION_RESOURCE_NAME, functionResourceExample, { dependencies: ['config2']}
                );
                ioc.registerClass(
                    CLASS_RESOURCE_NAME,    ClassResourceExample,    { dependencies: ['config2', FUNCTION_RESOURCE_NAME]}
                );

                const computeResult = ioc.resolve(CLASS_RESOURCE_NAME).compute(this.target);
                const funcResource = functionResourceExample(anotherConfig);
                const classResultReference = (new ClassResourceExample(anotherConfig, funcResource)).compute(this.target);

                expect(computeResult).to.be.equal(classResultReference);
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
        beforeEach(function () {
            this.parentIoc = new IoCContainer();

            this.parentIoc.register(SIMPLE_RESOURCE_NAME, simpleResourceExample);
            this.parentIoc.registerFactory(FUNCTION_RESOURCE_NAME, functionResourceExample);
        });

        afterEach(function () {
            delete this.parentIoc;
        });

        describe('with explicit setting TRUE', function () {
            beforeEach(function () {
                this.childIoc = this.parentIoc.createChild({explicit: true});

                this.childIoc.registerClass(CLASS_RESOURCE_NAME, ClassResourceExample);
            });

            afterEach(function () {
                delete this.childIoc;
            });

            it('should resolve resources from parent transparently', function () {
                let simpleResourceValue = this.childIoc.resolve(SIMPLE_RESOURCE_NAME);
                let funcResourceValue = this.childIoc.resolve(FUNCTION_RESOURCE_NAME);

                expect(simpleResourceValue, 'Simple resource didn\'t resolved from parent')
                    .to.equal(simpleResourceExample);
                expect(funcResourceValue(this.target, 'Func resource didn\'t resolved from parent'))
                    .to.equal(this.funcResultReference);
            });

            it('should resolve dependencies from parent for registered resource', function () {
                let classResourceValue = this.childIoc.resolve(CLASS_RESOURCE_NAME);

                expect(classResourceValue).to.be.an.instanceof(ClassResourceExample);
                expect(
                    classResourceValue.compute(this.target),
                    'Resolved resource behaviour are different due to wrong resolving of dependencies'
                ).to.equal(this.classResultReference);
            });
        });


        describe('with explicit setting FALSE', function () {

            beforeEach(function () {
                this.childIoc = this.parentIoc.createChild({explicit: false});

                this.childIoc.registerClass(CLASS_RESOURCE_NAME, ClassResourceExample);
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
                    classResourceValue.compute(this.target),
                    'Resolved resource behaviour are different due to wrong resolving of dependencies'
                ).to.equal(this.classResultReference);
            });
        });

        describe('should use right priority to resolve resources from parent', function () {

            beforeEach(function () {
                const ParentClassResource = class {
                    compute() {
                        return false;
                    }
                };

                this.parentIoc.registerClass(CLASS_RESOURCE_NAME, ParentClassResource);
                
                this.childIoc = this.parentIoc.createChild();
                this.childIoc.registerClass(CLASS_RESOURCE_NAME, ClassResourceExample);
            });

            afterEach(function () {
                delete this.childIoc;
            });

            it('should look for own resources and dependencies; and only if not found - in parent', function () {
                let classResourceValue = this.childIoc.resolve(CLASS_RESOURCE_NAME);

                expect(classResourceValue).to.be.an.instanceof(ClassResourceExample);
                expect(
                    classResourceValue.compute(this.target),
                    'Resolved resource behaviour are different due to wrong resolving of dependencies'
                ).to.equal(this.classResultReference);
            });
        });
    });

    describe('for classes and factories which should be singletons', function () {
        beforeEach(function () {
            this.ioc = new IoCContainer();
            this.ioc.register(SIMPLE_RESOURCE_NAME, simpleResourceExample);
            this.ioc.registerFactory(FUNCTION_RESOURCE_NAME, functionResourceExample);
        });
        
        afterEach(function() {
            delete this.ioc;
        });

        it('should be registered resource as singleton in case if resource property $singleton set to TRUE', function () {
            let SingletonClass = class extends ClassResourceExample {
                static $singleton = true;
            };

            this.ioc.registerClass(CLASS_RESOURCE_NAME, SingletonClass);

            let instance1 = this.ioc.resolve(CLASS_RESOURCE_NAME);
            let instance2 = this.ioc.resolve(CLASS_RESOURCE_NAME);

            expect(instance1).to.be.equal(instance2);
        });

        it('should used setting singleton from method call instead of resource $singleton property', function () {
            let SingletonClass = class extends ClassResourceExample {
                static $singleton = false;
            };

            this.ioc.registerClass(CLASS_RESOURCE_NAME, SingletonClass, { singleton: true });

            let instance1 = this.ioc.resolve(CLASS_RESOURCE_NAME);
            let instance2 = this.ioc.resolve(CLASS_RESOURCE_NAME);

            expect(instance1).to.be.equal(instance2);
        });
    });

    // Accepts ioc aggregator
    //   Allows to resolves dependencies
    //   Allows to resolves resources
});

