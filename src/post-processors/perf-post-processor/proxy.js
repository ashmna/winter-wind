// @flow

const { ProxyClassHandler, ProxyMethodHandler } = require("../../index");
const { PerformancePostProcessor } = require("./index");

class PerformanceProxyClassHandler<T: Object> extends ProxyClassHandler<T> {
    processor: PerformancePostProcessor;

    constructor(processor: PerformancePostProcessor) {
        super();
        this.processor = processor;
    }

    getProxyMethodHandler(): any {
        return new PerformanceProxyMethodHandler(this.processor);
    }
}

class PerformanceProxyMethodHandler<T: Object> extends ProxyMethodHandler<T> {
    processor: PerformancePostProcessor;

    constructor(processor: PerformancePostProcessor) {
        super();
        this.processor = processor;
    }

    before(target: T, thisArgument: any, argumentsList: any[]) {
        return {
            callable: true,
            params: {
                startAt: Date.now(),
            },
        };
    }

    after(target: T, thisArgument: any, argumentsList: any[], result: any, params: Object): any {
        this.processor.register(target, thisArgument, params.startAt, Date.now());
        return result;
    }

    exceptionHandler(error: Error): { throwable: boolean, result?: any } {
        return { throwable: true, result: void 0 };
    }
}

module.exports = { PerformanceProxyClassHandler };
