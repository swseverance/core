import React from "react";
import ReactDOM from "react-dom";
import GlueWebPlatform from '@glue42/web-platform';
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "./App.css";
import App from "./App";
import { GlueProvider } from '@glue42/react-hooks';
import * as serviceWorker from "./serviceWorker";

const config = {
  channels: {
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
        name: "DarkYellow",
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
  }
};

ReactDOM.render(
  <GlueProvider settings={{ webPlatform: { factory: GlueWebPlatform, config } }}>
    <App />
  </GlueProvider>,
  document.getElementById("root")
);

serviceWorker.register();
