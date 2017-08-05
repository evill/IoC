import IoCContainer from '../../src/ioc-container';
import IoCAggregator from '../../src/ioc-aggregator';
import { simpleResourceExample, functionResourceExample/*, ClassResourceExample*/ } from '../fixtures/resources';

const SIMPLE_RESOURCE_NAME = 'config';
const FUNCTION_RESOURCE_NAME = 'modifier';
// const CLASS_RESOURCE_NAME = 'increment';

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

    describe('register method', function () {
        beforeEach(function() {
            this.aggregator = new IoCAggregator();
            this.container = new IoCContainer();

            this.container.register(simpleResourceExample, SIMPLE_RESOURCE_NAME);
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

    describe('created with setting parentExplicit FALSE', function () {

        beforeEach(function() {
            this.aggregator = new IoCAggregator([], { parentExplicit: false });

            this.topContainer = new IoCContainer();
            this.topContainer.register(simpleResourceExample, SIMPLE_RESOURCE_NAME);

            this.container = new IoCContainer({parent: this.topContainer, parentExplicit: true});
            this.container.registerFunc(functionResourceExample, FUNCTION_RESOURCE_NAME);

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
