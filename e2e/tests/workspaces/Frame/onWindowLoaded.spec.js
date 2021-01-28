describe('frame.onWindowLoaded ', () => {
    const windowConfig = {
        type: "window",
        appName: "dummyApp"
    };

    const basicConfig = {
        children: [
            {
                type: "column",
                children: [windowConfig]
            }
        ]
    }

    const duoSChildrenConfig = {
        children: [
            {
                type: "row",
                children: [windowConfig, windowConfig]
            }
        ]
    };

    let unSubFuncs = [];
    let timeout;
    let defaultFrame;
    let defaultWorkspace;

    before(() => coreReady);

    beforeEach((done) => {
        let unSub;
        const ready = gtf.waitFor(2, () => {
            unSub();
            done();
        });

        glue.workspaces.onWindowLoaded(ready)
            .then((un) => {
                unSub = un;
                return glue.workspaces.createWorkspace(basicConfig);
            })
            .then((wsp) => {
                defaultWorkspace = wsp;
                defaultFrame = wsp.frame;
                ready();
            }).catch(done);
    });

    afterEach(async () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }

        const frames = await glue.workspaces.getAllFrames();
        await Promise.all(frames.map((frame) => frame.close()));

        defaultFrame = null;
        defaultWorkspace = null;

        unSubFuncs.forEach((unSub) => {
            if (typeof unSub === "function") {
                unSub();
            }
        });
        unSubFuncs = [];
    });

    it('should return a promise, which resolves with a function', async () => {
        const windowLoadedPromise = defaultFrame.onWindowLoaded(() => { });

        expect(windowLoadedPromise.then).to.be.a("function");
        expect(windowLoadedPromise.catch).to.be.a("function");

        const windowLoadedResult = await windowLoadedPromise;

        expect(windowLoadedResult).to.be.a("function");

        unSubFuncs.push(windowLoadedResult);
    });

    it('should not notify when immediately unsubscribed', (done) => {
        const ready = gtf.waitFor(2, done);

        timeout = setTimeout(ready, 3000);

        defaultFrame
            .onWindowLoaded(() => {
                done("Should not have been called.");
            })
            .then((unSub) => {
                unSub();
                return glue.workspaces.createWorkspace(basicConfig);
            })
            .then(ready)
            .catch(done);
    });

    it('should not notify when unsubscribing after receiving notifications', (done) => {
        const ready = gtf.waitFor(3, done);

        let unSub;
        let called = false;

        timeout = setTimeout(ready, 3000);

        defaultFrame
            .onWindowLoaded(() => {
                if (!called) {
                    called = true;
                    unSub();
                    glue.workspaces.createWorkspace(basicConfig).then(ready).catch(done);
                    return;
                }
                done("Should not have been called");
            })
            .then((un) => {
                unSub = un;
                return glue.workspaces.createWorkspace(basicConfig);
            })
            .then(ready)
            .catch(done);
    });

    [
        undefined,
        null,
        42,
        true,
        {},
        { test: () => { } },
        "function",
        [() => { }]
    ].forEach((input) => {
        it(`should reject if the provided parameter is not a function: ${JSON.stringify(input)}`, (done) => {
            defaultFrame.onWindowLoaded(input)
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    done(`Should have resolved, because the provided parameter is not valid: ${JSON.stringify(input)}`);
                })
                .catch(() => {
                    done();
                });
        });
    });

    describe('action: new workspace ', () => {
        it('should notify when a window was loaded', (done) => {
            const ready = gtf.waitFor(2, done);

            defaultFrame.onWindowLoaded(ready)
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return glue.workspaces.createWorkspace(basicConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('should notify exactly once when a window was loaded', (done) => {
            const ready = gtf.waitFor(3, done);
            let called = false;

            timeout = setTimeout(ready, 3000);

            defaultFrame.onWindowLoaded(() => {
                if (called) {
                    done("Should have been called again");
                    return;
                }
                called = true;
                ready();
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return glue.workspaces.createWorkspace(basicConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('should notify exactly once when a window was loaded in a new workspace in this frame and another workspace in a different frame', (done) => {
            const ready = gtf.waitFor(3, done);
            let called = false;

            timeout = setTimeout(ready, 3000);
            const newFrameCreateConfig = Object.assign({}, basicConfig, { frame: { newFrame: true } });

            defaultFrame.onWindowLoaded(() => {
                if (called) {
                    done("Should have been called again");
                    return;
                }
                called = true;
                ready();
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return Promise.all([
                        glue.workspaces.createWorkspace(basicConfig),
                        glue.workspaces.createWorkspace(newFrameCreateConfig)
                    ])
                })
                .then(ready)
                .catch(done);
        });

        it('should notify with a valid workspace window when a window was loaded', (done) => {
            const ready = gtf.waitFor(2, done);

            defaultFrame.onWindowLoaded((win) => {
                try {
                    expect(win.id).to.be.a('string');
                    expect(win.frameId).to.be.a('string');
                    expect(win.appName).to.eql('dummyApp');
                    expect(win.workspaceId).to.be.a('string');
                    expect(win.isLoaded).to.be.true;
                    ready();
                } catch (error) {
                    done(error);
                }
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return glue.workspaces.createWorkspace(basicConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('should notify twice when the restored workspace was two windows', (done) => {
            const ready = gtf.waitFor(3, done);

            defaultFrame.onWindowLoaded(ready)
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return glue.workspaces.createWorkspace(duoSChildrenConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('should notify twice when restoring two workspaces with one window each (parallel)', (done) => {
            const ready = gtf.waitFor(3, done);

            defaultFrame.onWindowLoaded(ready)
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return Promise.all([
                        glue.workspaces.createWorkspace(basicConfig),
                        glue.workspaces.createWorkspace(basicConfig)
                    ])
                })
                .then(ready)
                .catch(done);
        });

        it('should notify twice when restoring two workspaces with one window each (sequential)', (done) => {
            const ready = gtf.waitFor(3, done);

            defaultFrame.onWindowLoaded(ready)
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return glue.workspaces.createWorkspace(basicConfig);
                })
                .then(() => glue.workspaces.createWorkspace(basicConfig))
                .then(ready)
                .catch(done);
        });

        it('should notify twice when restoring two workspaces with one window each (on notify)', (done) => {
            const ready = gtf.waitFor(3, done);
            let openOneMore = true;

            defaultFrame.onWindowLoaded(() => {
                if (openOneMore) {
                    glue.workspaces.createWorkspace(basicConfig).then(ready).catch(done);
                }
                openOneMore = false;
                ready();
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return glue.workspaces.createWorkspace(basicConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('the provided workspace window should have correct workspace id and frame id', (done) => {
            const data = {};
            let heardWin;
            const ready = gtf.waitFor(2, () => {
                try {
                    expect(heardWin.frameId).to.eql(data.frameId);
                    expect(heardWin.workspaceId).to.eql(data.workspaceId);
                    done();
                } catch (error) {
                    done(error);
                }
            });

            defaultFrame.onWindowLoaded((win) => {
                heardWin = win;
                ready();
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return glue.workspaces.createWorkspace(basicConfig);
                })
                .then((wsp) => {
                    data.frameId = wsp.frameId;
                    data.workspaceId = wsp.id;
                })
                .then(ready)
                .catch(done);
        });

        it('the loaded window should exist in the windows collection', (done) => {
            const ready = gtf.waitFor(2, done);

            defaultFrame.onWindowLoaded((w) => {
                try {
                    expect(glue.windows.list().some((win) => win.id === w.id)).to.be.true;
                    ready();
                } catch (error) {
                    done(error);
                }
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return glue.workspaces.createWorkspace(basicConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('the loaded window should exist in the workspace windows collection by window id', (done) => {
            const ready = gtf.waitFor(2, done);

            defaultFrame.onWindowLoaded(async (w) => {
                try {
                    const found = await glue.workspaces.getWindow((win) => win.id === w.id);
                    expect(found).to.not.be.undefined;
                    ready();
                } catch (error) {
                    done(error);
                }
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return glue.workspaces.createWorkspace(basicConfig);
                })
                .then(ready)
                .catch(done);
        });

    });

    describe('action: existing workspace ', () => {

        it('should notify when a window was loaded', (done) => {
            const ready = gtf.waitFor(2, done);

            defaultFrame.onWindowLoaded(ready)
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return defaultWorkspace.addWindow(windowConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('should not notify when a window was loaded in a different frame', (done) => {
            const ready = gtf.waitFor(2, done);
            let otherWorkspace;

            timeout = setTimeout(ready, 3000);

            const prepare = () => {
                return new Promise((resolve) => {
                    let unSub;
                    const r = gtf.waitFor(2, () => {
                        unSub();
                        resolve();
                    })

                    glue.workspaces.onWindowLoaded(r)
                        .then((un) => {
                            unSub = un;
                            const newFrameCreateConfig = Object.assign({}, basicConfig, { frame: { newFrame: true } });
                            return glue.workspaces.createWorkspace(newFrameCreateConfig);
                        })
                        .then((wsp) => {
                            otherWorkspace = wsp;
                            r();
                        });
                })
            }

            prepare()
                .then(() => {
                    return defaultFrame.onWindowLoaded(() => done("Should have been called, because the added window is in a different frame"));
                })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return otherWorkspace.addWindow(windowConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('should notify with a valid workspace window when a window was loaded', (done) => {
            const ready = gtf.waitFor(2, done);

            defaultFrame.onWindowLoaded((win) => {
                try {
                    expect(win.id).to.be.a('string');
                    expect(win.frameId).to.be.a('string');
                    expect(win.appName).to.eql('dummyApp');
                    expect(win.workspaceId).to.be.a('string');
                    expect(win.isLoaded).to.be.true;
                    ready();
                } catch (error) {
                    done(error);
                }
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return defaultWorkspace.addWindow(windowConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('the provided workspace window should have correct workspace id and frame id', (done) => {
            const ready = gtf.waitFor(2, done);

            defaultFrame.onWindowLoaded((win) => {
                try {
                    expect(win.frameId).to.eql(defaultWorkspace.frameId);
                    expect(win.workspaceId).to.eql(defaultWorkspace.id);
                    ready();
                } catch (error) {
                    done(error);
                }
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return defaultWorkspace.addWindow(windowConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('the loaded window should exist in the windows collection', (done) => {
            const ready = gtf.waitFor(2, done);

            defaultFrame.onWindowLoaded((w) => {
                try {
                    expect(glue.windows.list().some((win) => win.id === w.id)).to.be.true;
                    ready();
                } catch (error) {
                    done(error);
                }
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return defaultWorkspace.addWindow(windowConfig);
                })
                .then(ready)
                .catch(done);
        });

        it('the loaded window should exist in the workspace windows collection by window id', (done) => {
            const ready = gtf.waitFor(2, done);

            defaultFrame.onWindowLoaded(async (w) => {
                try {
                    const found = await glue.workspaces.getWindow((win) => win.id === w.id);
                    expect(found).to.not.be.undefined;
                    ready();
                } catch (error) {
                    done(error);
                }
            })
                .then((unSub) => {
                    unSubFuncs.push(unSub);
                    return defaultWorkspace.addWindow(windowConfig);
                })
                .then(ready)
                .catch(done);
        });

    });
});
