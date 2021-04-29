describe("lock() Should", () => {
    const basicConfig = {
        children: [
            {
                type: "row",
                children: [
                    {
                        type: "column",
                        children: [
                            {
                                type: "row",
                                children: [
                                    {
                                        type: "group",
                                        children: [
                                            {
                                                type: "window",
                                                appName: "noGlueApp"
                                            },
                                            {
                                                type: "window",
                                                appName: "noGlueApp"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: "column",
                        children: [
                            {
                                type: "row",
                                children: [
                                    {
                                        type: "group",
                                        children: [
                                            {
                                                type: "window",
                                                appName: "noGlueApp"
                                            },
                                            {
                                                type: "window",
                                                appName: "noGlueApp"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    let workspace;
    before(() => coreReady);
    beforeEach(async () => {
        workspace = await glue.workspaces.createWorkspace(basicConfig);
        await Promise.all(workspace.getAllWindows().map(w => w.forceLoad()));
    });

    afterEach(async () => {
        const wsps = await glue.workspaces.getAllWorkspaces();
        await Promise.all(wsps.map((wsp) => wsp.close()));
    });


    // allowExtract?: boolean;
    // showCloseButton?: boolean;

    ["allowExtract", "showCloseButton"].forEach((propertyUnderTest) => {
        it(`Should set ${propertyUnderTest} to false when invoked without arguments`, async () => {
            const window = workspace.getAllWindows()[0];

            await window.lock();
            await workspace.refreshReference();

            expect(window[propertyUnderTest]).to.eql(false);
        });

        it(`Should set ${propertyUnderTest} to true when invoked with an empty object`, async () => {
            const window = workspace.getAllWindows()[0];

            await window.lock({});
            await workspace.refreshReference();

            expect(window[propertyUnderTest]).to.eql(true);
        });

        [true, false].forEach((value) => {
            it(`set ${propertyUnderTest} to ${value} when invoked with an ${propertyUnderTest}:${value}`, async () => {
                const window = workspace.getAllWindows()[0];

                await window.lock({
                    [`${propertyUnderTest}`]: value
                });

                await workspace.refreshReference();
                expect(window[propertyUnderTest]).to.eql(value);
            });

            it(`set ${propertyUnderTest} to ${value} when invoked with a function which returns an object with ${propertyUnderTest}:${value}`, async () => {
                const window = workspace.getAllWindows()[0];

                await window.lock(() => ({
                    [`${propertyUnderTest}`]: value
                }));

                await workspace.refreshReference();
                expect(window[propertyUnderTest]).to.eql(value);
            });

            it(`invoke the builder function with an object with ${propertyUnderTest} to ${value} when invoked with a function`, async () => {
                const window = workspace.getAllWindows()[0];

                await window.lock({
                    [`${propertyUnderTest}`]: value
                });

                await workspace.refreshReference();
                await window.lock((builder) => {
                    expect(builder[propertyUnderTest]).to.eql(value);
                });
            });
        });
    });

    it("be able to override the parent allowExtract when the parent is disabled and the the window is explicitly set to to true", async () => {
        const window = workspace.getAllWindows()[0];
        const parent = window.parent;

        await parent.lock();
        await window.lock({ allowExtract: true });

        await workspace.refreshReference();

        expect(window.allowExtract).to.eql(true);
    });

    it("preserve the neighbouring windows value when overriding the allowExtract property of the parent", async () => {
        const window = workspace.getAllWindows()[0];
        const parent = window.parent;

        await parent.lock();
        await window.lock({ allowExtract: true });

        await workspace.refreshReference();

        const otherWindow = parent.children.find(c => c.id !== window.id);

        expect(otherWindow.allowExtract).to.eql(false);
    });
});