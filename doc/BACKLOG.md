Backlog
=============

Foundation
----------
- [ ] Remove excess things like tests, travis config, documentation from npm package
- [ ] Provide creation of release on GitHub
- [ ] Provide eslint validation
- [ ] Register package in yarn 

Documentation
-------------

- [ ] Provide main API documentation
- [ ] Provide advanced usage examples and blueprints

Features
--------

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

Integrations
------------

- [ ] Provide integration with React
- [ ] Provide integration with Redux
- [ ] Provide integration with Express Js
