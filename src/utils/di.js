// @flow

const {PostProcessor} = require("./post-processor");

const SINGLETON = 0x01;
const PROTOTYPE = 0x02;
const SESSION = 0x03;

type Scope = SINGLETON | PROTOTYPE | SESSION;

type InjectableOption = {
    scope: Scope;
    dependencies?: ObjectConstructor[];
}

type InMapParams = {
    option: InjectableOption,
    constructor: ObjectConstructor,
    instance?: any,
};

const injectableClasses: Map<string, InMapParams> = new Map();

function Injectable(option: InjectableOption) {
    return (constructor: ObjectConstructor) => {
        injectableClasses.set(constructor.name, {option, constructor});
    };
}

Injectable.SINGLETON = SINGLETON;
Injectable.PROTOTYPE = PROTOTYPE;
Injectable.SESSION = SESSION;

class NotInjectableError extends Error {
    constructor(constructor: ObjectConstructor) {
        super(`Class "${constructor.name}" does not exist or not make as Injectable`)
    }
}

const postProcessors = new Symbol("postProcessors");

class Container {
    [postProcessors]: PostProcessor[];

    constructor() {
        this[postProcessors] = [];
    }

    enablePostProcessor(postProcessor: PostProcessor) {
        this[postProcessors].push(postProcessor);
    }

    get<T>(constructor: T): T {
        if (!injectableClasses.has(constructor.name)) {
            throw new NotInjectableError(constructor);
        }
        const params = injectableClasses.get(constructor.name);
        if (params.option.scope === PROTOTYPE) {
            return this.createInstance(constructor, params.option.dependencies);
        }

        // todo: implement SESSION scope
        if (params.option.scope !== SINGLETON) {
            return this.createInstance(constructor, params.option.dependencies);
        }

        if (!params.instance) {
            params.instance = this.createInstance(constructor, params.option.dependencies);
            injectableClasses.set(constructor.name, params);
        }

        return params.instance;
    }

    createInstance<T>(constructor: T, dependencies: ObjectConstructor[] = []): T {
        const instance = new ({[constructor.name]: constructor})[constructor.name](
            ...dependencies.map(dependency => this.get(dependency))
        );

        return this.afterInitialization(this.beforeInitialization(instance));
    }

    beforeInitialization<T>(instance: T): T {
        return this[postProcessors]
            .reduce((instance, postProcessor) => postProcessor.beforeInitialization(instance), instance);
    }

    afterInitialization<T>(instance: T): T {
        return this[postProcessors]
            .reduce((instance, postProcessor) => postProcessor.afterInitialization(instance), instance);
    }
}


module.exports = {
    Injectable,
    Container,
};