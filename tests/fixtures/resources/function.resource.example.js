let functionResourceExample = (config) => (target) => target * config.multiplier;

functionResourceExample.$inject = ['config'];

export default functionResourceExample;
