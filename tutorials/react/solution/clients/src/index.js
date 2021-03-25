import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "./App.css";
import Clients from "./Clients";
import * as serviceWorker from "./serviceWorker";
import { GlueProvider } from "@glue42/react-hooks";
import GlueWebPlatform from "@glue42/web-platform";
import GlueWorkspaces from "@glue42/workspaces-api";

// Defining Workspace layouts.
const layouts = {
    mode: "idb",
    local: [
        {
            name: "Client Space",
            type: "Workspace",
            metadata: {},
            components: [
                {
                    type: "Workspace",
                    state: {
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
                                                        config: {
                                                            appName: "Client Details",
                                                            title: "React App",
                                                            context: {}
                                                        }
                                                    }
                                                ],
                                                config: {}
                                            },
                                            {
                                                type: "column",
                                                children: [
                                                    {
                                                        type: "group",
                                                        children: [
                                                            {
                                                                type: "window",
                                                                config: {
                                                                    appName: "Stocks",
                                                                    title: "React App",
                                                                    context: {}
                                                                }
                                                            }
                                                        ],
                                                        config: {}
                                                    }
                                                ],
                                                config: {}
                                            }
                                        ],
                                        config: {}
                                    }
                                ],
                                config: {}
                            }
                        ],
                        config: {
                            name: "Client Space",
                            title: "Untitled 1"
                        },
                        context: {}
                    }
                }
            ]
        }
    ]
};

// Defining system Channels.
const channels = {
    definitions: [
        {
            name: "Red",
            meta: {
                color: "red"
            }
        },
        {
            name: "Green",
            meta: {
                color: "green"
            }
        },
        {
            name: "Blue",
            meta: {
                color: "#66ABFF"
            }
        },
        {
            name: "Pink",
            meta: {
                color: "#F328BB"
            }
        },
        {
            name: "Yellow",
            meta: {
                color: "#FFE733"
            }
        },
        {
            name: "Dark Yellow",
            meta: {
                color: "#b09b00"
            }
        },
        {
            name: "Orange",
            meta: {
                color: "#fa5a28"
            }
        },
        {
            name: "Purple",
            meta: {
                color: "#c873ff"
            }
        },
        {
            name: "Lime",
            meta: {
                color: "#8af59e"
            }
        },
        {
            name: "Cyan",
            meta: {
                color: "#80f3ff"
            }
        }
    ]
};

// Define application configurations.
const applications = {
    local: [
        {
            name: "Clients",
            type: "window",
            details: {
                url: "http://localhost:3000/clients"
            }
        },
        {
            name: "Stocks",
            type: "window",
            details: {
                url: "http://localhost:3001/stocks",
                left: 0,
                top: 0,
                width: 860,
                height: 600
            }
        },
        {
            name: "Stock Details",
            type: "window",
            details: {
                url: "http://localhost:3002/details",
                left: 100,
                top: 100,
                width: 400,
                height: 400
            }
        },
        {
            name: "Client Details",
            type: "window",
            details: {
                url: "http://localhost:3003/client-details"
            }
        }
    ]
};

// Define the configuration object and pass it to the factory function.
const config = {
    // Pass the `GlueWorkspaces` factory function.
    glue: { libraries: [GlueWorkspaces] },
    // Specify the location of the Workspaces App.
    workspaces: { src: "http://localhost:9300/" },
    // Pass predefined Workspace layouts.
    layouts,
    channels,
    applications
};

const settings  = {
    webPlatform: {
        factory: GlueWebPlatform,
        config
    }
};

ReactDOM.render(
    <GlueProvider settings={settings}>
        <Clients />
    </GlueProvider>,
    document.getElementById("root")
);

serviceWorker.register();
