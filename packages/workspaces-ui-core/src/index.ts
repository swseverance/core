
import manager from "./manager";
import facade from "./interop/facade";
import jquery from "jquery";
import GlueWeb, { Glue42Web } from "@glue42/web";
import GlueWorkspaces from "@glue42/workspaces-api";
import startupReader from "./config/startupReader";


declare const window: Window & { glue: Glue42Web.API; $: JQueryStatic };

const config = {
    application: "Workspaces",
    appManager: true,
    libraries: [GlueWorkspaces]
};

window.$ = jquery;
let done: () => void;

window.addEventListener("beforeunload", () => {
    facade.dispose();
    if (done) {
        done();
    }
});

// isInFrame prevents recursion if by accident an invalid url is entered for one of the application
const isInIframe = window.frameElement;
if (!isInIframe) {
    GlueWeb(config).then((glue) => {
        window.glue = glue;
        facade.subscribeForWorkspaceEvents();
        return manager.init(window.glue, glue.agm.instance.windowId,facade);
    }).then(({ cleanUp }) => {
        done = cleanUp;
        return facade.init(window.glue, window.glue.agm.instance.windowId);
        // tslint:disable-next-line: no-console
    }).then(() => {
        if (!startupReader.config.emptyFrame) {
            manager.workspacesEventEmitter.raiseFrameEvent({ action: "opened", payload: { frameSummary: { id: window.glue.agm.instance.windowId } } });
        }
    }).catch(console.warn);
}

export default manager;
