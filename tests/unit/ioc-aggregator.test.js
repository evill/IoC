import IoCContainer from '../../src/ioc-container';
import IoCAggregator from '../../src/ioc-aggregator';
import { simpleResourceExample, functionResourceExample, ClassResourceExample } from '../fixtures/resources';
import { iocFactory, iocClass } from '../../src/ioc-registrars';

const SIMPLE_RESOURCE_NAME = 'config';
const FUNCTION_RESOURCE_NAME = 'modifier';
const CLASS_RESOURCE_NAME = 'increment';

describe('IoCAggregator class', function () {
    describe('Constructor', function () {
        it('should create new instance of IoCAggregator', function () {
            let ioc = new IoCAggregator();

            expect(ioc).to.be.an.instanceof(IoCAggregator);
        });

        it('should allow to pass containers', function () {
            let ioc = new IoCAggregator([new IoCContainer(), new IoCAggregator()]);

            expect(ioc).to.be.an.instanceof(IoCAggregator);
        });
    });

    describe('registerContainer method', function () {
        beforeEach(function() {
            this.aggregator = new IoCAggregator();
            this.container = new IoCContainer();

            this.container.register(SIMPLE_RESOURCE_NAME, simpleResourceExample);
        });
        
        afterEach(function() {
            delete this.aggregator;
            delete this.container;
        });
        
        it('should allow to add new container as member of aggregator', function () {
            this.aggregator.registerContainer(this.container);

            let simpleResource = this.aggregator.resolve(SIMPLE_RESOURCE_NAME);


            expect(simpleResource).to.equal(simpleResourceExample);
        });

        it('should allow to add new aggregator as member of aggregator', function () {
            let parentAggregator = new IoCAggregator([this.container]);

            this.aggregator.registerContainer(parentAggregator);

            let simpleResource = this.aggregator.resolve(SIMPLE_RESOURCE_NAME);

            expect(simpleResource).to.equal(simpleResourceExample);
        });
    });

    describe('method resolveAll', function() {
        it('should allow to resolve several resources by list of names', function () {
            let ioc = new IoCContainer();
            let aggregator = new IoCAggregator([ ioc ]);

            ioc.registerAll({
                [SIMPLE_RESOURCE_NAME]: simpleResourceExample,
                [FUNCTION_RESOURCE_NAME]: iocFactory(functionResourceExample).asSingleton(),
                [CLASS_RESOURCE_NAME]: iocClass(ClassResourceExample).asSingleton()
            });

            let resourcesValues = aggregator.resolveAll([SIMPLE_RESOURCE_NAME, FUNCTION_RESOURCE_NAME, CLASS_RESOURCE_NAME]);

            let resourcesValuesTarget = {
                [SIMPLE_RESOURCE_NAME]: aggregator.resolve(SIMPLE_RESOURCE_NAME),
                [FUNCTION_RESOURCE_NAME]: aggregator.resolve(FUNCTION_RESOURCE_NAME),
                [CLASS_RESOURCE_NAME]: aggregator.resolve(CLASS_RESOURCE_NAME)
            };

            expect(resourcesValues).to.deep.equal(resourcesValuesTarget);
        });
    });

    describe('created with setting parentExplicit FALSE', function () {

        beforeEach(function() {
            this.aggregator = new IoCAggregator([], { parentExplicit: false });

            this.topContainer = new IoCContainer();
            this.topContainer.register(SIMPLE_RESOURCE_NAME, simpleResourceExample);

            this.container = new IoCContainer({parent: this.topContainer, parentExplicit: true});
            this.container.registerFactory(FUNCTION_RESOURCE_NAME, functionResourceExample);

            this.computeTarget = 5;

            this.computeReference = functionResourceExample(simpleResourceExample)(this.computeTarget);
        });

        afterEach(function() {
            delete this.aggregator;
            delete this.container;
            delete this.topContainer;
            delete this.computeTarget;
            delete this.computeReference;
        });

        it('should deny resolving of resources from parent of nested containers', function () {
            this.aggregator.registerContainer(this.container);

            let functionResource = this.aggregator.resolve(FUNCTION_RESOURCE_NAME);

            expect(functionResource(this.computeTarget)).to.equal(this.computeReference);
            expect(this.aggregator.resolve(SIMPLE_RESOURCE_NAME)).to.be.null;
        });

        it('should deny resolving of resources from parent of containers from own aggregators', function () {
            let parentAggregator = new IoCAggregator([this.container]);
            
            this.aggregator.registerContainer(parentAggregator);

            let functionResource = this.aggregator.resolve(FUNCTION_RESOURCE_NAME);

            expect(functionResource(this.computeTarget)).to.equal(this.computeReference);
            expect(this.aggregator.resolve(SIMPLE_RESOURCE_NAME)).to.be.null;
        });
    });
});

