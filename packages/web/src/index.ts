/* eslint-disable @typescript-eslint/no-explicit-any */

import { createFactoryFunction } from "./web";
import createGlueCore from "@glue42/core";
import { version } from "../package.json";

const glueWebFactory = createFactoryFunction(createGlueCore);

// attach to window object
if (typeof window !== "undefined") {
    const windowAny = window as any;

    windowAny.GlueWeb = glueWebFactory;

    delete windowAny.GlueCore;
}

if (!window.glue42gd && !(window as any).glue42core) {

    (window as any).glue42core = { webStarted: false };

}

(glueWebFactory as any).version = version;

export default glueWebFactory;
