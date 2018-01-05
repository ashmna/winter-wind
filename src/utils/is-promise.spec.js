const {describe, it} = require("mocha");
const {strictEqual} = require("assert");
const {isPromise} = require("./is-promise");


describe("Test isPromise", () => {
    it("static types", done => {
        strictEqual(isPromise(null), false);
        strictEqual(isPromise(undefined), false);
        strictEqual(isPromise(void 0), false);
        strictEqual(isPromise("string"), false);
        strictEqual(isPromise(String("string")), false);
        strictEqual(isPromise(1), false);
        strictEqual(isPromise(0), false);
        strictEqual(isPromise(Number(1)), false);
        strictEqual(isPromise(1.1), false);
        strictEqual(isPromise(Number(1.1)), false);
        done();
    });
    it("object and function", done => {
        strictEqual(isPromise({}), false);
        strictEqual(isPromise(function () {
        }), false);
        strictEqual(isPromise(() => {
        }), false);
        done();
    });
    it("promise", done => {
        strictEqual(isPromise(new Promise(resolve => {
        })), true);
        done();
    });
});
