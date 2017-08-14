import IoCContainer from '../../src/ioc-container';
import { iocFactory, iocClass } from '../../src/ioc-registrars';
import { simpleResourceExample, functionResourceExample, ClassResourceExample} from '../fixtures/resources';

const SIMPLE_RESOURCE_NAME = 'config';
const FUNCTION_RESOURCE_NAME = 'modifier';
const CLASS_RESOURCE_NAME = 'increment';

describe('Registrar', function () {
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
    
    beforeEach(function() {
        this.container = new IoCContainer();

        this.container.register(SIMPLE_RESOURCE_NAME, simpleResourceExample);
    });

    afterEach(function() {
        delete this.container;
    });

    describe('iocFunc', function () {

        it('should correct register function', function () {
            this.container.register(
                FUNCTION_RESOURCE_NAME,
                iocFactory(functionResourceExample)
            );
            
            let funcResourceValue = this.container.resolve(FUNCTION_RESOURCE_NAME);

            expect(funcResourceValue(this.target)).to.equal(this.funcResultReference);
        });

        it('should correct register func as singleton', function () {
            this.container.register(
                FUNCTION_RESOURCE_NAME,
                iocFactory(functionResourceExample).asSingleton()
            );

            let result1 = this.container.resolve(FUNCTION_RESOURCE_NAME);
            let result2 = this.container.resolve(FUNCTION_RESOURCE_NAME);

            expect(result2).to.equal(result1);
        });
    });

    describe('iocClass', function () {

        beforeEach(function() {
            this.container.registerFactory(FUNCTION_RESOURCE_NAME, functionResourceExample);
        });

        it('should correct register class', function () {
            this.container.register(
                CLASS_RESOURCE_NAME,
                iocClass(ClassResourceExample)
            );

            let classResourceValue = this.container.resolve(CLASS_RESOURCE_NAME);
            
            expect(classResourceValue.compute(this.target)).to.equal(this.classResultReference);
        });

        it('should correct register class as singleton', function () {
            this.container.register(
                CLASS_RESOURCE_NAME,
                iocClass(ClassResourceExample).asSingleton()
            );

            let result1 = this.container.resolve(CLASS_RESOURCE_NAME);
            let result2 = this.container.resolve(CLASS_RESOURCE_NAME);

            expect(result2).to.equal(result1);
        });
    });
});

