export let dependencyResolverMock = (dependencies) => (name) => {
    if (dependencies.hasOwnProperty(name)) {
        return dependencies[name];
    }

    return null;
};

export let dependencyResolverStub = dependencyResolverMock({});
