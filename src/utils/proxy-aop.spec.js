
const {describe, it} = require("mocha");
const {proxyClassHandler, proxyMethodHandler} = require("./proxy-aop");

class Test {
    method() {
        return 1;
    }

    async method2() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return 1;
    }
}


describe("Proxy", () => {
    it("ProxyClass", async done => {
        const testObj = new Test();
        const testProxy = new Proxy(testObj, proxyClassHandler);
        testProxy.method();
        done();
    });
});
