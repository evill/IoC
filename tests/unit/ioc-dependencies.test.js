import IoCContainer from '../../src/ioc-container';
import { iocFactory, iocClass } from '../../src/ioc-registrars';
import { iocOptional } from '../../src/dependencies';
import {
    simpleResourceExample, SIMPLE_RESOURCE_NAME,
    functionResourceExample, FUNCTION_RESOURCE_NAME,
    ClassResourceExample, CLASS_RESOURCE_NAME
} from '../fixtures/resources';

class ClassWithOptionalDependency extends ClassResourceExample {
    static $inject = [
        SIMPLE_RESOURCE_NAME,
        FUNCTION_RESOURCE_NAME,
        iocOptional('divider')
    ];

    constructor(config, modifier, divider) {
        super(config, modifier);
        this.divider = divider;
    }
}

class ClassWithOptionalDefaultDependency extends ClassWithOptionalDependency {
    static $inject = [
        SIMPLE_RESOURCE_NAME,
        FUNCTION_RESOURCE_NAME,
        iocOptional('divider').withDefault(10)
    ];
}



describe('Resource dependencies', function () {
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
        this.container.register(FUNCTION_RESOURCE_NAME, iocFactory(functionResourceExample));
    });

    afterEach(function() {
        delete this.container;
    });

    describe('defined with optional dependency wrapper', function () {

        it('should resolve dependency as Null if it is absent in container instead of throwing error', function () {
            this.container.register(
                CLASS_RESOURCE_NAME,
                iocClass(ClassWithOptionalDependency)
            );

            let classResourceValue = this.container.resolve(CLASS_RESOURCE_NAME);

            expect(classResourceValue.divider).to.be.null;
        });

        it('should resolve absent dependency value which was defined as default in optional dependency', function () {
            this.container.register(
                CLASS_RESOURCE_NAME,
                iocClass(ClassWithOptionalDefaultDependency)
            );

            let classResourceValue = this.container.resolve(CLASS_RESOURCE_NAME);

            expect(classResourceValue.divider).to.equal(10);
        });
    });
});

