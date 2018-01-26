type Scope = 0x01 | 0x02 | 0x03;

type InjectableOption = {
    scope: Scope,
    dependencies?: Object.constructor[],
};

type InMapParams = {
    option: InjectableOption,
    constructor: Object.constructor,
    instance?: any,
};

const injectableClasses: Map<string, InMapParams> = new Map();

function Injectable(option: InjectableOption) {
    return (constructor: Object.constructor) => {
        injectableClasses.set(constructor.name, { option, constructor });
    };
}

Injectable.SINGLETON = 0x01;
Injectable.PROTOTYPE = 0x02;
Injectable.SESSION = 0x03;

class NotInjectableError extends Error {
    constructor(constructor: Object.constructor) {
        super(`Class "${constructor.name}" does not exist or not make as Injectable`);
    }
}

module.exports = {
    Injectable,
    injectableClasses,
    NotInjectableError,
};
