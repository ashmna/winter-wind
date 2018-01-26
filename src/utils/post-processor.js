// @flow

class PostProcessor {
    beforeInitialization<T: Object>(instance: T): T {
        return instance;
    }

    afterInitialization<T: Object>(instance: T): T {
        return instance;
    }
}

module.exports = {
    PostProcessor,
};
