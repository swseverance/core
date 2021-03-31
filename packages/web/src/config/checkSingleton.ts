/* eslint-disable @typescript-eslint/no-explicit-any */
export const checkSingleton = (): void => {
    const glue42CoreNamespace = (window as any).glue42core;

    if (glue42CoreNamespace && glue42CoreNamespace.webStarted) {
        throw new Error("The Glue42 Core Web has already been started for this application.");
    }

    if (!glue42CoreNamespace) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).glue42core = { webStarted: true };
        return;
    }

    glue42CoreNamespace.webStarted = true;
};
