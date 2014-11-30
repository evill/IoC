IoCCallable extends IoCResource
+ constructor(manager : IoCManager, resource : Function, dependencies : Array)
+ resolve() : Any
+ singleton() : Boolean