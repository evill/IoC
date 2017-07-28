Backlog
=============

Foundation
----------

- [ ] Complete unit tests
- [ ] Write usage documentation
- [ ] Provide npm package
- [ ] Provide eslint validation
- [ ] Provide CI with travis

Documentation
-------------

- [ ] Provide main API documentation
- [ ] Provide base usage examples
- [ ] Provide advanced usage examples and blueprints

Features
--------

- [ ] IoC Container validation
  * Provide ability to resolve list of missed dependencies in container using method `findMissedDependencies() : Array|Null`
  * Provide ability validate that all resources and dependencies exists in container using method `validate() : Boolean`
- [ ] Make container destroyable
  * Provide ability to free all resource using public method `destroy()` of IoC Container
  * Provide ability to free all resource using public method `destroy()` of IoC Aggregator
- [ ] Parent(s) filter
  * Provide ability to set which resources and dependencies can be resolved from parent container on IoC Container or Aggregator creation.  
  * Provide ability to pass filter to method getChild
- [ ] Provide building of assets by babel
- [ ] Provide ability to use aliases for resources names
- [ ] Provide decorators:
  * List of dependencies
  * Resource aliases

Integrations
------------

- [ ] Provide integration with React
- [ ] Provide integration with Redux
- [ ] Provide integration with Express Js
