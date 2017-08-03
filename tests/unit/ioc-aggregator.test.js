import IoCContainer from '../../src/ioc-container';
import IoCAggregator from '../../src/ioc-aggregator';
import { simpleResourceExample /*, functionResourceExample, ClassResourceExample*/ } from '../fixtures/resources';

const SIMPLE_RESOURCE_NAME = 'config';
// const FUNCTION_RESOURCE_NAME = 'modifier';
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
        it('should allow to add new container as member of aggregator', function () {
            let aggregator = new IoCAggregator();

            let container = new IoCContainer();

            container.register(simpleResourceExample, SIMPLE_RESOURCE_NAME);

            aggregator.registerContainer(container);

            let simpleResource = aggregator.resolve(SIMPLE_RESOURCE_NAME);


            expect(simpleResource).to.equal(simpleResourceExample);
        });

        it('should allow to add new aggregator as member of aggregator', function () {
            let aggregator = new IoCAggregator();

            let container = new IoCContainer();

            container.register(simpleResourceExample, SIMPLE_RESOURCE_NAME);
            
            let parentAggregator = new IoCAggregator([container]);

            aggregator.registerContainer(parentAggregator);

            let simpleResource = aggregator.resolve(SIMPLE_RESOURCE_NAME);

            expect(simpleResource).to.equal(simpleResourceExample);
        });
    });
});
