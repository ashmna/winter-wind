const { isPromise } = require("./is-promise");

class PropertyNotFound extends Error {
    constructor(property, className) {
        super(`${property} not found in class ${className}`);
    }
}

class ProxyMethodHandler {
    apply(target: any, thisArgument: any, argumentsList: any[]): any {
        try {
            const before = this.before(target, thisArgument, argumentsList);

            if (!before.callable) {
                return before.result;
            }

            const result = target.apply(thisArgument, argumentsList);

            if (isPromise(result)) {
                return new Promise((resolve, reject) => {
                    result
                        .then(result => {
                            resolve(this.after(target, thisArgument, argumentsList, result));
                        })
                        .catch(error => {
                            try {
                                const { throwable = true, result } = this.exceptionHandler(error);
                                if (!throwable) {
                                    resolve(result);
                                    return;
                                }
                                reject(error);
                            } catch (error) {
                                reject(error);
                            }
                        });
                });
            }

            return this.after(target, thisArgument, argumentsList, result);
        } catch (error) {
            const { throwable = true, result } = this.exceptionHandler(error);
            if (!throwable) {
                return result;
            }
            throw error;
        }
    }

    before(target: any, thisArgument: any, argumentsList: any[]): { callable: boolean, result?: any } {
        return { callable: true };
    }

    after(target: any, thisArgument: any, argumentsList: any[], result: any): any {
        return result;
    }

    exceptionHandler(error: Error): { throwable: boolean, result?: any } {
        return { throwable: true, result: void 0 };
    }
}

class ProxyClassHandler {
    get(target: any, property: string) {
        if (!(property in target)) {
            throw new PropertyNotFound(property, target.constructor.name);
        }
        if (typeof target[property] !== "function") {
            return target[property];
        }
        return new Proxy(target[property], this.getProxyMethodHandler());
    }

    getProxyMethodHandler(): any {
        return new ProxyMethodHandler();
    }
}

module.exports = {
    ProxyMethodHandler,
    ProxyClassHandler,
};
