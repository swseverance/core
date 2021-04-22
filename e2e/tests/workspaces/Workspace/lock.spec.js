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
                                type: "group",
                                children: [
                                    {
                                        type: "window",
                                        appName: "noGlueApp"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: "column",
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

    let workspace;
    before(() => coreReady);
    beforeEach(async () => {
        workspace = await glue.workspaces.createWorkspace(basicConfig);
    });

    afterEach(async () => {
        const wsps = await glue.workspaces.getAllWorkspaces();
        await Promise.all(wsps.map((wsp) => wsp.close()));
    });

    it("resolve when invoked without arguments", async () => {
        await workspace.lock();
    });

    it("not set allowDrop constraint when invoked without arguments", async () => {
        await workspace.lock();

        expect(workspace.allowDrop).to.be.true;
    });

    it("not set allowDrop constraint to children when invoked without arguments", async () => {
        await workspace.lock();
        await workspace.refreshReference();

        const allBoxes = workspace.getAllBoxes();

        allBoxes.forEach(b => {
            expect(b.allowDrop).to.be.true;
        });
    });

    ["showSaveButton", "showCloseButton", "allowExtract", "allowSplitters", "allowDropLeft", "allowDropTop", "allowDropRight", "allowDropBottom"].forEach(propertyUnderTest => {
        it(`invoke the builder function with an object with ${propertyUnderTest}: true when invoked with a function`, async () => {
            await workspace.lock((config) => {
                expect(config[propertyUnderTest]).to.be.eql(true);
            });
        });

        it(`set ${propertyUnderTest} constraint when invoked without arguments`, async () => {
            await workspace.lock();

            expect(workspace[propertyUnderTest]).to.be.false;
        });

        it(`remove ${propertyUnderTest} constraint when invoked with an empty object`, async () => {
            await workspace.lock({});

            expect(workspace[propertyUnderTest]).to.be.true;
        });

        it(`remove ${propertyUnderTest} constraint when invoked with a function that returns an empty object`, async () => {
            await workspace.lock(() => ({}));

            expect(workspace[propertyUnderTest]).to.be.true;
        });

        if (propertyUnderTest === "allowDropLeft" || propertyUnderTest === "allowDropTop" || propertyUnderTest === "allowDropRight" || propertyUnderTest === "allowDropBottom") {
            it(`set ${propertyUnderTest} constraint when invoked with allowDrop false`, async () => {
                await workspace.lock({ allowDrop: false });

                expect(workspace[propertyUnderTest]).to.be.false;
            });
        }

        [true, false].forEach((value) => {
            it(`set ${propertyUnderTest} constraint when invoked with ${propertyUnderTest}: ${value}`, async () => {
                await workspace.lock({ [`${propertyUnderTest}`]: value });

                expect(workspace[propertyUnderTest]).to.be.eql(value);
            });

            it(`invoke the builder function with an object with ${propertyUnderTest} constraint when invoked with ${propertyUnderTest}: ${value}`, async () => {
                await workspace.lock({ [`${propertyUnderTest}`]: value });

                await workspace.lock((config) => {
                    expect(config[propertyUnderTest]).to.be.eql(value);
                });
            });
        });
    });

    it("set allowExtract constraint to children when invoked without arguments", async () => {
        await workspace.lock();
        await workspace.refreshReference();

        const allGroups = workspace.getAllGroups();
        const allWindows = workspace.getAllWindows();

        allGroups.forEach(g => {
            expect(g.allowDrop).to.be.true;
        });

        allWindows.forEach(w => {
            expect(w.allowExtract).to.be.false;
        });
    });

    it("not set allowDrop constraint when invoked with all other constraints removed and allowDrop false", async () => {
        await workspace.lock({
            allowSplitters: true,
            allowExtract: true,
            showCloseButton: true,
            showSaveButton: true,
            allowDrop: false
        });

        expect(workspace.allowDrop).to.be.true;
    });

    it("set allowSplitters constraint when invoked with all other constraints removed and allowSplitters false", async () => {
        await workspace.lock({
            allowSplitters: false,
            allowExtract: true,
            showCloseButton: true,
            showSaveButton: true,
            allowDrop: true
        });

        expect(workspace.allowSplitters).to.be.false;
    });

    it("set allowExtract constraint when invoked with all other constraints removed and allowExtract false", async () => {
        await workspace.lock({
            allowSplitters: true,
            allowExtract: false,
            showCloseButton: true,
            showSaveButton: true,
            allowDrop: true
        });

        expect(workspace.allowExtract).to.be.false;
    });

    it("set showCloseButton constraint when invoked with all other constraints removed and showCloseButton false", async () => {
        await workspace.lock({
            allowSplitters: true,
            allowExtract: true,
            showCloseButton: false,
            showSaveButton: true,
            allowDrop: true
        });

        expect(workspace.showCloseButton).to.be.false;
    });

    it("set showSaveButton constraint when invoked with all other constraints removed and showSaveButton false", async () => {
        await workspace.lock({
            allowSplitters: true,
            allowExtract: true,
            showCloseButton: true,
            showSaveButton: false,
            allowDrop: true
        });

        expect(workspace.showSaveButton).to.be.false;
    });

    it("resolve when invoked with an empty object", async () => {
        await workspace.lock({});
    });

    it("remove allowDrop constraint when invoked with all other constraints set and allowDrop true", async () => {
        await workspace.lock({
            allowSplitters: false,
            allowExtract: false,
            showCloseButton: false,
            showSaveButton: false,
            allowDrop: true
        });

        expect(workspace.allowDrop).to.be.true;
    });

    it("remove allowSplitters constraint when invoked with all other constraints set and allowSplitters true", async () => {
        await workspace.lock({
            allowSplitters: true,
            allowExtract: false,
            showCloseButton: false,
            showSaveButton: false,
            allowDrop: false
        });

        expect(workspace.allowSplitters).to.be.true;
    });

    it("remove allowExtract constraint when invoked with all other constraints set and allowExtract true", async () => {
        await workspace.lock({
            allowSplitters: false,
            allowExtract: true,
            showCloseButton: false,
            showSaveButton: false,
            allowDrop: false
        });

        expect(workspace.allowExtract).to.be.true;
    });

    it("remove showCloseButton constraint when invoked with all other constraints set and showCloseButton true", async () => {
        await workspace.lock({
            allowSplitters: false,
            allowExtract: false,
            showCloseButton: true,
            showSaveButton: false,
            allowDrop: false
        });

        expect(workspace.showCloseButton).to.be.true;
    });

    it("remove showSaveButton constraint when invoked with all other constraints set and showSaveButton true", async () => {
        await workspace.lock({
            allowSplitters: false,
            allowExtract: false,
            showCloseButton: false,
            showSaveButton: true,
            allowDrop: false
        });

        expect(workspace.showSaveButton).to.be.true;
    });

    it("not set the allowDrop constraint when invoked with a function and all other constraints removed and allowDrop false", async () => {
        await workspace.lock(() => ({
            allowSplitters: true,
            allowExtract: true,
            showCloseButton: true,
            showSaveButton: true,
            allowDrop: false
        }));

        expect(workspace.allowDrop).to.be.true;
    });

    it("set allowSplitters constraint when invoked with a function and all other constraints removed and allowSplitters false", async () => {
        await workspace.lock(() => ({
            allowSplitters: false,
            allowExtract: true,
            showCloseButton: true,
            showSaveButton: true,
            allowDrop: true
        }));

        expect(workspace.allowSplitters).to.be.false;
    });

    it("set allowExtract constraint when invoked with a function and all other constraints removed and allowExtract false", async () => {
        await workspace.lock(() => ({
            allowSplitters: true,
            allowExtract: false,
            showCloseButton: true,
            showSaveButton: true,
            allowDrop: true
        }));

        expect(workspace.allowExtract).to.be.false;
    });

    it("set showCloseButton constraint when invoked with a function and all other constraints removed and showCloseButton false", async () => {
        await workspace.lock(() => ({
            allowSplitters: true,
            allowExtract: true,
            showCloseButton: false,
            showSaveButton: true,
            allowDrop: true
        }));

        expect(workspace.showCloseButton).to.be.false;
    });

    it("set showSaveButton constraint when invoked with a function and all other constraints removed and showSaveButton false", async () => {
        await workspace.lock(() => ({
            allowSplitters: true,
            allowExtract: true,
            showCloseButton: true,
            showSaveButton: false,
            allowDrop: true
        }));

        expect(workspace.showSaveButton).to.be.false;
    });

    it("resolve when invoked with a function that returns an empty object", async () => {
        await workspace.lock(() => ({}));
    });

    it("remove allowDrop constraint when invoked with a function with all other constraints set and allowDrop true", async () => {
        await workspace.lock(() => ({
            allowSplitters: false,
            allowExtract: false,
            showCloseButton: false,
            showSaveButton: false,
            allowDrop: true
        }));

        expect(workspace.allowDrop).to.be.true;
    });

    it("remove allowSplitters constraint when invoked with a function with all other constraints set and allowSplitters true", async () => {
        await workspace.lock(() => ({
            allowSplitters: true,
            allowExtract: false,
            showCloseButton: false,
            showSaveButton: false,
            allowDrop: false
        }));

        expect(workspace.allowSplitters).to.be.true;
    });

    it("remove allowExtract constraint when invoked with a function with all other constraints set and allowExtract true", async () => {
        await workspace.lock(() => ({
            allowSplitters: false,
            allowExtract: true,
            showCloseButton: false,
            showSaveButton: false,
            allowDrop: false
        }));

        expect(workspace.allowExtract).to.be.true;
    });

    it("remove showCloseButton constraint when invoked with a function with all other constraints set and showCloseButton true", async () => {
        await workspace.lock(() => ({
            allowSplitters: false,
            allowExtract: false,
            showCloseButton: true,
            showSaveButton: false,
            allowDrop: false
        }));

        expect(workspace.showCloseButton).to.be.true;
    });

    it("remove showSaveButton constraint when invoked with a function with all other constraints set and showSaveButton true", async () => {
        await workspace.lock((config) => ({
            allowSplitters: false,
            allowExtract: false,
            showCloseButton: false,
            showSaveButton: true,
            allowDrop: false
        }));

        expect(workspace.showSaveButton).to.be.true;
    });

    it("unlock the workspace when the workspaces is locked and the arguments are an empty object", async () => {
        await workspace.lock();

        await workspace.lock({});

        expect(workspace.showSaveButton).to.be.true;
        expect(workspace.allowSplitters).to.be.true;
        expect(workspace.allowExtract).to.be.true;
        expect(workspace.showCloseButton).to.be.true;
        expect(workspace.showSaveButton).to.be.true;
        expect(workspace.allowDrop).to.be.true;
    });

    it("preserve the lock settings when the workspace has been locked in an empty state", async () => {
        const emptyWorkspace = await glue.workspaces.createWorkspace({ children: [] });

        await emptyWorkspace.lock();

        await emptyWorkspace.addColumn({
            type: "column",
            children: [
                {
                    type: "group",
                    children: [{
                        type: "window",
                        appName: "noGlueApp"
                    }]
                }
            ]
        });

        await emptyWorkspace.refreshReference();

        expect(emptyWorkspace.allowDrop).to.be.true;
        expect(emptyWorkspace.allowExtract).to.be.false;
        expect(emptyWorkspace.showCloseButton).to.be.false;
        expect(emptyWorkspace.showSaveButton).to.be.false;
        expect(emptyWorkspace.allowSplitters).to.be.false;
    });

    it("remove the lock settings when the workspace has been reused", async () => {
        await workspace.lock();

        const emptyWorkspace = await glue.workspaces.createWorkspace({
            children: [{
                type: "column",
                children: [
                    {
                        type: "group",
                        children: [{
                            type: "window",
                            appName: "noGlueApp"
                        }]
                    }
                ]
            }],
            config: {
                reuseWorkspaceId: workspace.id,
            }
        });

        await emptyWorkspace.refreshReference();

        expect(emptyWorkspace.allowDrop).to.be.true;
        expect(emptyWorkspace.allowExtract).to.be.true;
        expect(emptyWorkspace.showCloseButton).to.be.true;
        expect(emptyWorkspace.showSaveButton).to.be.true;
        expect(emptyWorkspace.allowSplitters).to.be.true;
    });
});