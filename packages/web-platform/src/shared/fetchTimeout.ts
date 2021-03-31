import { defaultFetchTimeoutMs } from "../common/defaultConfig";

export const fetchTimeout = (request: string | Request, timeoutMilliseconds = defaultFetchTimeoutMs): Promise<Response> => {
    return new Promise((resolve, reject) => {
        let timeoutHit = false;
        const timeout = setTimeout(() => {
            timeoutHit = true;
            reject(new Error(`Fetch request for: ${JSON.stringify(request)} timed out at: ${timeoutMilliseconds} milliseconds`));
        }, timeoutMilliseconds);

        fetch(request)
            .then((response) => {
                if (!timeoutHit) {
                    clearTimeout(timeout);
                    resolve(response);
                }
            })
            .catch((err) => {
                if (!timeoutHit) {
                    clearTimeout(timeout);
                    reject(err);
                }
            });
    });
};
