import Resource from '../../../src/resources/simple.resource';
import simpleResourceExample from '../../fixtures/resources/simple.resource.example';

describe('SimpleResource class', function () {

    before(function() {
        this.resource = new Resource(simpleResourceExample);
    });

    after(() => {
        delete this.resource;
    });
    
    describe('constructor', function () {
        it('should create new instance of SimpleResource', function () {
            expect(this.resource).to.be.an.instanceof(Resource);
        });
    });
    describe('resolve method', function () {
        it('should return origin registered resource', function () {
            expect(this.resource.resolve()).to.equal(simpleResourceExample);
        });
    });
});
