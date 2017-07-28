export default class ClassResourceExample {
    static $inject = ['config', 'modifier'];

    constructor(config, modifier) {
        this.config = config;
        this.modifier = modifier;
    }
    compute(target) {
        return this.config.increment + this.modifier(target);
    }
}
