Backlog
=============

Foundation
----------

- [ ] Complete unit tests
- [ ] Write usage documentation
- [ ] Provide npm package
- [ ] Provide eslint validation
- [ ] Register package in yarn 
- [x] Provide CI with travis

Documentation
-------------

- [ ] Provide main API documentation
- [ ] Provide base usage examples
- [ ] Provide advanced usage examples and blueprints

Features
--------

- [x] Ability to specify list of dependencies factories and classes on resource registration instead of resource definition
  * Pass list of dependencies to methods `registerFactory` and `registerClass`
  * Pass list of dependencies using `iocClass` and `iocFactory` registrars for unified registration.
- [ ] Provide ability of two way connection between composition of resources. Example - Register.
- [ ] IoC Container validation
  * Provide ability to resolve list of missed dependencies in container using method `findMissedDependencies() : Array|Null`
  * Provide ability validate that all resources and dependencies exists in container using method `validate() : Boolean`
- [ ] Make container destroyable
  * Provide ability to free all resource using public method `destroy()` of IoC Container
  * Provide ability to free all resource using public method `destroy()` of IoC Aggregator
- [ ] Parent(s) filter
  * Provide ability to set which resources and dependencies can be resolved from parent container on IoC Container or Aggregator creation.  
  * Provide ability to pass filter to method getChild
- [ ] Provide ability to use aliases for resources names
- [ ] Provide decorators:
  * List of dependencies
  * Resource aliases
- [x] Provide building of assets by babel

Integrations
------------

- [ ] Provide integration with React
- [ ] Provide integration with Redux
- [ ] Provide integration with Express Js
