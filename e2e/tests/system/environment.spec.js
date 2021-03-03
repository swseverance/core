describe("environment ", () => {
    before(() => {
        return coreReady;
    });

    it("There should be a defined glue42core object", () => {
        const glue42core = window.glue42core;

        expect(glue42core).to.not.be.undefined;
        expect(glue42core).to.be.an("object");
    });

    it("The glue42core object should contain an environment property", () => {
        const glue42core = window.glue42core;

        expect(glue42core.environment).to.not.be.undefined;
        expect(glue42core.environment).to.be.an("object");
    });

    it("The environment property should contain correct data", () => {
        const env = window.glue42core.environment;

        const expected = {
            test: 42,
            testObj: {
                test: 42
            },
            testArr: [42]
        };

        expect(env).to.eql(expected);
    });
});
