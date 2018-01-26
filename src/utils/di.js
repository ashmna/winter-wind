// @flow

const { PostProcessor } = require("./post-processor");
const { Injectable, NotInjectableError, injectableClasses } = require("./injectable");

class Container {
    postProcessors: PostProcessor[];

    constructor() {
        this.postProcessors = [];
    }

    enablePostProcessor(postProcessor: PostProcessor) {
        this.postProcessors.push(postProcessor);
    }

    get<T: Object.constructor>(constructor: T) {
        const params = injectableClasses.get(constructor.name);
        if (!params) {
            throw new NotInjectableError(constructor);
        }

        if (params.option.scope === Injectable.PROTOTYPE) {
            return this.createInstance(constructor, params.option.dependencies);
        }

        // todo: implement SESSION scope

        if (params.option.scope !== Injectable.SINGLETON) {
            return this.createInstance(constructor, params.option.dependencies);
        }

        if (!params.instance) {
            params.instance = this.createInstance(constructor, params.option.dependencies);
            injectableClasses.set(constructor.name, params);
        }

        return params.instance;
    }

    createInstance<T: Object.constructor>(constructor: T, dependencies: Object.constructor[] = []) {
        const instance = new { [constructor.name]: constructor }[constructor.name](
            ...dependencies.map(dependency => this.get(dependency))
        );

        return this.afterInitialization(this.beforeInitialization(instance));
    }

    beforeInitialization<T: Object>(instance: T): T {
        return this.postProcessors.reduce(
            (instance: T, postProcessor: PostProcessor) => postProcessor.beforeInitialization(instance),
            instance
        );
    }

    afterInitialization<T: Object>(instance: T): T {
        return this.postProcessors.reduce(
            (instance: T, postProcessor: PostProcessor) => postProcessor.afterInitialization(instance),
            instance
        );
    }
}

module.exports = { Container };
