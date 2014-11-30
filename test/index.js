var expect = require('chai').expect,
    IoC = require('..');

describe('ioc', function() {
  it('should say hello', function(done) {
    expect(IoC()).to.equal('Hello, world');
    done();
  });
});
