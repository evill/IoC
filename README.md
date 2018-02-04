[![Build Status](https://travis-ci.org/evill/IoC.svg?branch=master)](https://travis-ci.org/evill/IoC)

# Introduction

IoC Container is the library which provides inversion of control functionality for javascript projects.

Documentation still in progress

## Links to articles
* [Fowler: Inversion of Control Containers and the Dependency Injection pattern](https://martinfowler.com/articles/injection.html)
* [Fowler: Inversion of control](https://martinfowler.com/bliki/InversionOfControl.html)
* [Wiki: Inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control)

# Installation

`npm install ioc-container`

# Usage

Base usage of ioc container in application can be described by follow phases:
1. Creation of IoC container
2. Registration of resources in IoC container. In most cases this activity should be performed on bootstrap phase of your application
3. Resolving resources from IoC container. This activities performed during runtime of your application for serve functionality.

## Container creation
Creation of new IoC Container

```javascript
import {IoCContainer} from 'ioc-container';

let container = new IoCContainer();
```

## Registration of resources in container

After container will be created you can register 3 types of resources in container:
- Simple resource. Represents any data which can be stored in container without dependencies and resolved as is.
- Factory resource. Represents resource which will be resolved via calling of factory function.
- Class resource. Represents resource which will be resolved with instantiation of registered constructor. 

Details of usage each of these resource will be described in next sections.

For any resource which you want to store in container should be passed name of this resource. Name of resource will be
used for associate registered resource with string identifier which can be used for resolve resource from container in future.

```javascript
import {IoCContainer} from 'ioc-container';

let container = new IoCContainer();

// Example of simple resource registration
container.register('someObject', { api: "/api/v2"} );

// Example of factory resource registration
container.registerFactory('someFactory', () => { someFunction() {} });

// Example of class resource registration
container.registerClass('someClass', class { someMethod() {} });
```

## Resolving of resources from container

Each resource can be resolved using method `IoCContainer.resolve` which takes name of resource and returns result of resolving.

```javascript
// ... Creation of ioc container and registration of resources from previous section

// will return object "{ api: "/api/v2"}"
container.resolve('someObject');

// will return object "{ someFunction() {} }" which will be result of call factory function
container.resolve('someFactory');

// will return object "{ someMethod() {} }" which will be instance of registered class
container.resolve('someClass');
```

IoCContainer also allows to resolve several resources by one call:

```javascript
// ... Creation of ioc container and registration of resources from previous section

container.resolveAll(['someObject', 'someFactory']);
// will return object where keys are resource names and values result of resource resolving:
// {
//     someObject: { api: "/api/v2"}
//     someFactory: { someFunction() {} }
// }
```

## Unified registration

There is possible to register all types of resources via methods `register()` and `registerAll()` of IoC containers. For this should be used specific decorators called registrars. There are two types of registrars:
- for factories - `iocFactory()`
- for classes - `iocClass()`
  
    Unfortunately Javascript doesn't make difference between simple function and constructor of class. So for describe
    which type of resource we are trying to register in IoC Container we should use registrars.
    
Under the hood registrars don't change origin function. They just assists to iocContainer to understand which method should be called inside method register for registration of new resource.
    
**Example of unified registration for single resource:**

```javascript
import {IoCContainer, iocFactory, iocClass} from 'ioc-container';

let container = new IoCContainer();

// For simple resource we use same approach
container.register('someObject', { api: "/api/v2"} );

// For registration factory resource should be used iocFactory registrar 
container.register(
    'someFactory',
    iocFactory( () => { someFunction() {} } )
);

// For registration class or constructor resource should be used iocClass registrar
container.register(
    'someClass',
    iocClass( class { someMethod() {} } )
);
```

**Example of unified registration for several resources:**

```javascript
import {IoCContainer, iocFactory, iocClass} from 'ioc-container';

let container = new IoCContainer();

container.registerAll({
    'someObject' : { api: "/api/v2"},
    'someFactory': iocFactory( () => { someFunction() {} } ),
    'someClass'  : iocClass( class { someMethod() {} } )
});
```

## Dependencies

The main responsibility of IoC Container is resolve dependencies and pass them to factories and constructors.
List of dependencies is array of resources names which should be registered in IoC container.
For declare list of dependencies for factory or class target function which will be registered in IoC container should defines special property '$inject' with array of dependencies names.
 
```javascript
import {IoCContainer, iocFactory, iocClass} from 'ioc-container';

let container = new IoCContainer();

let someObject = { api: "/api/v2"};

let someFactory = function(simpleResource) {
    return {
        someFunction() {
            return `Called endpoint ${simpleResource.api}`
        }
    };
};
factory.$inject = ['someObject'];

class SomeClass {
    static $inject = [ 'someObject', 'someFactory' ];
    
    constructor(object, factory) {
        console.log('object', object);
        console.log('factory', factory);
    }
} 

container.registerAll({
    'someObject' : someObject,
    'someFactory': iocFactory(someFactory),
    'someClass'  : iocClass(SomeClass)
});

container.resolve('someObject');
// will return object "{ api: "/api/v2"}"

container.resolve('someFactory').someFunction();
// will return string 'Called endpoint /api/v2'

container.resolve('someClass');
// will print to console two lines:
// Firs - someObject
// Second - result of call someFactory

```

### Optional dependencies

There are two type of dependencies:
- required
- optional

By default when dependencies specified as list of resources names all dependencies will be used as required. And container during resolving of missed required dependency for any resource will throw error.

As we already know dependencies will be injected as arguments to factory or constructor. In ES2015 there is possible to specify default values of function parameters which was not passed on function call. IoC Container provide similar functionality for dependencies which called optional dependency. Optional dependency means that in case of resolving resource from factory or constructor in case if some dependency was not found in container error will not be thrown. IoC container will pass Null for this dependency parameter instead.
  
For specify that dependency is optional for dependency name should be used wrapper function called `iocOptional`.

Example of usage:

```javascript
import {IoCContainer, iocFactory, iocClass, iocOptional} from 'ioc-container';

let container = new IoCContainer();

class SomeClass {
    static $inject = [ iocOptional('someObject'), 'someFactory' ];
    
    constructor(object, factory) {
        console.log('object', object);
        console.log('factory', factory);
    }
} 

container.registerAll({
    'someFactory': iocFactory( () => { someFunction() {} } ),
    'someClass'  : iocClass(SomeClass)
});

// Constructor logic will output follow rows:
// 'object null'
// 'factory { someFunction() {} }'

```

There is possible to specify default value for optional dependency, which will be used is case if dependency absent in container, instead of Null:

```javascript
import {IoCContainer, iocFactory, iocClass, iocOptional} from 'ioc-container';

let container = new IoCContainer();

class SomeClass {
    static $inject = [ 
        iocOptional('someObject').withDefault({ defaultValue: true}),
        'someFactory'
    ];
    
    constructor(object, factory) {
        console.log('object', object);
        console.log('factory', factory);
    }
} 

container.registerAll({
    'someFactory': iocFactory( () => { someFunction() {} } ),
    'someClass'  : iocClass(SomeClass)
});

container.resolve('someClass');
// Constructor logic will output follow rows:
// 'object { defaultValue: true}'
// 'factory { someFunction() {} }'

container.register('someObject', { api: "/api/v2"} );

container.resolve('someClass');
// Constructor logic will output follow rows:
// 'object { api: "/api/v2"}'
// 'factory { someFunction() {} }'
```

## Singletons

[Wiki: Singleton pattern]https://en.wikipedia.org/wiki/Singleton_pattern

### Resource property
 
```javascript
import {IoCContainer} from 'ioc-container';

let container = new IoCContainer();

let someFactory = () => { someFunction() {} };
someFactory.$singleton = true;

class SomeClass {
    someMethod() {}
}

SomeClass.$singleton = true;

container.registerFactory('someFactory', someFactory);
container.registerClass('someClass', SomeClass);
```

### Methods parameter (setting) 
 
```javascript
import {IoCContainer} from 'ioc-container';

let container = new IoCContainer();

let someFactory = () => { someFunction() {} };

class SomeClass {
    someMethod() {}
}

container.registerFactory('someFactory', someFactory, { singleton: true });

container.registerClass('someClass', SomeClass, { singleton: true });
```

Using of registration method setting has higher priority that resource property. So in case if resource has property $singleton defined as true and it will be registered using ioc method with setting singleton set to false, resource will be registered in container not as singleton. 

### Unified registration

```javascript
import {IoCContainer, iocFactory, iocClass} from 'ioc-container';

let container = new IoCContainer();

let someFactory = () => { someFunction() {} };

class SomeClass {
    someMethod() {}
}

container.registerAll({
    'someFactory': iocFactory(someFactory).asSingleton(),
    'someClass'  : iocClass(SomeClass).asSingleton()
});
```
Unified registration uses methods parameter registration under the hood. So it will override resource $singleton property.

## [Composition and aggregation](./doc/COMPOSITION_AND_AGGREGATION.md)

Content:
- Composition of containers
  * parent container
  * explicit resolving of container resources
  * implicit resolving of container resources
  * child container
  * containers inheritance
- Aggregation of containers
  * aggregation of several containers
  * order of resolving resource from aggregator
  * explicit resolving of aggregated resources
  * implicit resolving of aggregated resources
  * child aggregator
  
## Extending of registrars

# [API](./doc/API.md)

Content:
- public interface of IoCContainer
- public interface of IoCAggregator
- public interface of registrars
- public interface of dependency decorator

# [Backlog](./doc/BACKLOG.md)
