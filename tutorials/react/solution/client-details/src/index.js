import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import GlueWeb from "@glue42/web";
import { GlueProvider } from "@glue42/react-hooks";
import "bootstrap/dist/css/bootstrap.css";
import ClientDetails from "./ClientDetails";
import GlueWorkspaces from "@glue42/workspaces-api";

const config = { libraries: [GlueWorkspaces] };

const settings  = {
    web: {
        factory: GlueWeb,
        config
    }
};

ReactDOM.render(
    <GlueProvider settings={settings}>
        <ClientDetails />
    </GlueProvider>,
    document.getElementById("root")
);
