// @flow

const { PostProcessor } = require("../../index");
const { PerformanceProxyClassHandler } = require("./proxy");

class PerformancePostProcessor extends PostProcessor {
    afterInitialization<T: Object>(instance: T): T {
        return new Proxy(instance, (new PerformanceProxyClassHandler(this): any));
    }

    register<T: Object>(target: T, thisArgument: any, startAt: number, endAt: number) {
        console.log(endAt - startAt, target, thisArgument);
    }
}

module.exports = {
    PerformancePostProcessor,
};
