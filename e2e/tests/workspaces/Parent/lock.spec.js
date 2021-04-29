describe("lock()", () => {
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
    });

    afterEach(async () => {
        const wsps = await glue.workspaces.getAllWorkspaces();
        await Promise.all(wsps.map((wsp) => wsp.close()));
    });

    describe("row", () => {
        //allowDrop
        it("Should set allowDrop to false when invoked without arguments and the container is a row", async () => {
            const row = workspace.getAllRows().find(r => r.children.length === 2);

            await row.lock();

            await workspace.refreshReference();

            expect(row.allowDrop).to.eql(false);
        });

        it("Should set allowDrop to false of all its children when invoked without arguments and the container is a row", async () => {
            const row = workspace.getAllRows().find(r => r.children.length === 2);

            await row.lock();

            await workspace.refreshReference();
            const immediateChildren = row.children;
            const childrenOfChildren = row.children.reduce((acc, c) => [...acc, ...c.children], []);

            immediateChildren.forEach((ic) => {
                expect(ic.allowDrop).to.eql(false);
            });

            childrenOfChildren.forEach((coc) => {
                expect(coc.allowDrop).to.eql(false);
            });
        });

        it("Should set allowDrop to true when invoked with an empty object and the container is a row", async () => {
            const row = workspace.getAllRows().find(r => r.children.length === 2);

            await row.lock({});

            await workspace.refreshReference();

            expect(row.allowDrop).to.eql(true);
        });

        [true, false].forEach((value) => {
            it(`Should set allowDrop to ${value} when invoked with an allowDrop:${value} and the container is a row`, async () => {
                const row = workspace.getAllRows().find(r => r.children.length === 2);

                await row.lock({
                    allowDrop: value
                });

                await workspace.refreshReference();
                expect(row.allowDrop).to.eql(value);
            });

            it(`Should set allowDrop to ${value} when invoked with a function which returns an object with allowDrop:${value} and the container is a row`, async () => {
                const row = workspace.getAllRows().find(r => r.children.length === 2);

                await row.lock(() => ({
                    allowDrop: value
                }));

                await workspace.refreshReference();
                expect(row.allowDrop).to.eql(value);
            });

            it(`Should invoke the builder function with allowDrop: ${value} when invoked with a function and the container is a row`, async () => {
                const row = workspace.getAllRows().find(r => r.children.length === 2);

                await row.lock(() => ({
                    allowDrop: value
                }));

                await row.lock((config) => {
                    expect(config.allowDrop).to.eql(value)
                });
            });
        });

        it("Should be able to override the parent allowDrop when the parent is disabled and the the container is explicitly set to to true", async () => {
            const row = workspace.getAllRows().find(r => r.children.length === 2);
            const parent = row.parent;

            await parent.lock();
            await row.lock({ allowDrop: true });

            await workspace.refreshReference();

            expect(row.allowDrop).to.eql(true);
        });
    });

    describe("column", () => {
        //allowDrop
        it("Should set allowDrop to false when invoked without arguments and the container is a column", async () => {
            const column = workspace.getAllColumns()[0];

            await column.lock();
            await workspace.refreshReference();

            expect(column.allowDrop).to.eql(false);
        });

        it("Should set allowDrop to false of all its children when invoked without arguments and the container is a column", async () => {
            const column = workspace.getAllColumns()[0];

            await column.lock();

            await workspace.refreshReference();
            const immediateChildren = column.children;
            const childrenOfChildren = column.children.reduce((acc, c) => [...acc, ...c.children], []);

            immediateChildren.forEach((ic) => {
                expect(ic.allowDrop).to.eql(false);
            });

            childrenOfChildren.forEach((coc) => {
                expect(coc.allowDrop).to.eql(false);
            });
        });

        it("Should set allowDrop to true when invoked with an empty object and the container is a column", async () => {
            const column = workspace.getAllColumns()[0];

            await column.lock({});

            await workspace.refreshReference();
            expect(column.allowDrop).to.eql(true);
        });

        [true, false].forEach((value) => {
            it(`Should set allowDrop to ${value} when invoked with an allowDrop:${value} and the container is a column`, async () => {
                const column = workspace.getAllColumns()[0];

                await column.lock({
                    allowDrop: value
                });

                await workspace.refreshReference();
                expect(column.allowDrop).to.eql(value);
            });

            it(`Should set allowDrop to ${value} when invoked with a function which returns and object with allowDrop:${value} and the container is a column`, async () => {
                const column = workspace.getAllColumns()[0];

                await column.lock(() => ({
                    allowDrop: value
                }));

                await workspace.refreshReference();
                expect(column.allowDrop).to.eql(value);
            });

            it(`Should invoke the builder function with allowDrop: ${value} when invoked with a function and the container is a column`, async () => {
                const column = workspace.getAllColumns()[0];

                await column.lock(() => ({
                    allowDrop: value
                }));

                await column.lock((config) => {
                    expect(config.allowDrop).to.eql(value)
                });
            });
        });

        it("Should be able to override the parent allowDrop when the parent is disabled and the the container is explicitly set to to true", async () => {
            const column = workspace.getAllColumns()[0];
            const parent = column.parent;

            await parent.lock();
            await column.lock({ allowDrop: true });

            await workspace.refreshReference();

            expect(column.allowDrop).to.eql(true);
        });
    });

    describe("group", () => {
        // allowExtract?: boolean;
        // allowDrop?: boolean;
        // showMaximizeButton?: boolean;
        // showEjectButton?: boolean;
        // showAddWindowButton?: boolean;

        ["allowExtract", "allowDrop", "showMaximizeButton", "showAddWindowButton", "showEjectButton"].forEach((propertyUnderTest) => {
            it(`Should set ${propertyUnderTest} to false when invoked without arguments and the container is a group`, async () => {
                const group = workspace.getAllGroups()[0];

                await group.lock();
                await workspace.refreshReference();

                expect(group[propertyUnderTest]).to.eql(false);
            });

            it(`Should set ${propertyUnderTest} to true when invoked with an empty object and the container is a group`, async () => {
                const group = workspace.getAllGroups()[0];

                await group.lock({});
                await workspace.refreshReference();

                expect(group[propertyUnderTest]).to.eql(true);
            });

            [true, false].forEach((value) => {
                it(`Should set ${propertyUnderTest} to ${value} when invoked with an ${propertyUnderTest}:${value} and the container is a group`, async () => {
                    const group = workspace.getAllGroups()[0];

                    await group.lock({
                        [`${propertyUnderTest}`]: value
                    });

                    await workspace.refreshReference();
                    expect(group[propertyUnderTest]).to.eql(value);
                });

                it(`Should set ${propertyUnderTest} to ${value} when invoked with a function which returns an object with ${propertyUnderTest}:${value} and the container is a group`, async () => {
                    const group = workspace.getAllGroups()[0];

                    await group.lock(() => ({
                        [`${propertyUnderTest}`]: value
                    }));

                    await workspace.refreshReference();
                    expect(group[propertyUnderTest]).to.eql(value);
                });

                it(`Should invoke the builder function with ${propertyUnderTest}: ${value} when invoked with a function and the container is a group`, async () => {
                    const group = workspace.getAllGroups()[0];

                    await group.lock(() => ({
                        [`${propertyUnderTest}`]: value
                    }));

                    await group.lock((config) => {
                        expect(config[propertyUnderTest]).to.eql(value)
                    });
                });
            });
        });

        it("Should set allowExtract to false of all its children when invoked without arguments and the container is a group", async () => {
            const group = workspace.getAllGroups()[0];

            await group.lock();

            await workspace.refreshReference();
            const immediateChildren = group.children;

            immediateChildren.forEach((ic) => {
                expect(ic.allowExtract).to.eql(false);
            });
        });

        it("Should be able to override the parent allowDrop when the parent is disabled and the the container is explicitly set to to true", async () => {
            const group = workspace.getAllGroups()[0];
            const parent = group.parent;

            await parent.lock();
            await group.lock({ allowDrop: true });

            await workspace.refreshReference();

            expect(group.allowDrop).to.eql(true);
        });
    });
});
