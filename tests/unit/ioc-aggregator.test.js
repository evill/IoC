// import IoCContainer from '../../lib/ioc-container';
import IoCAggregator from '../../lib/ioc-aggregator';
// import { simpleResourceExample, functionResourceExample, ClassResourceExample } from '../fixtures/resources';

// const SIMPLE_RESOURCE_NAME = 'config';
// const FUNCTION_RESOURCE_NAME = 'modifier';
// const CLASS_RESOURCE_NAME = 'increment';

describe('IoCAggregator class', function () {
    describe('Constructor', function () {
        it('should create new instance of IoCAggregator', function () {
            var ioc = new IoCAggregator([]);

            expect(ioc).to.be.an.instanceof(IoCAggregator);
        });
    });
});
