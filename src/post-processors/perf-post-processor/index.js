// @flow

const { PostProcessor, ProxyClassHandler, ProxyMethodHandler } = require("../../index");

class PerformanceProxyClassHandler<T: Object> extends ProxyClassHandler<T> {}

class PerformanceProxyMethodHandler<T: Object> extends ProxyMethodHandler<T> {}

class PerformancePostProcessor extends PostProcessor {
    beforeInitialization<T: Object>(instance: T): T {
        return instance;
    }

    afterInitialization<T: Object>(instance: T): T {
        return new Proxy(instance, new PerformanceProxyClassHandler());
    }
}
