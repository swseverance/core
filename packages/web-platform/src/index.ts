/* eslint-disable @typescript-eslint/no-explicit-any */
import { glueWebPlatformFactory } from "./factory";

if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).GlueWebPlatform = glueWebPlatformFactory;
}

if (!window.glue42gd && !(window as any).glue42core) {

    (window as any).glue42core = { webStarted: false };

}

export default glueWebPlatformFactory;
