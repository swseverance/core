export const waitFor = async (ms: number = 0, callback: () => void) => {
    await resolveAfter(ms);
    callback();
};

function resolveAfter<T>(ms: number = 0, result?: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export function rejectAfter<T>(ms: number = 0, promise: Promise<T>, error?: T): Promise<T> {
    let timeout: any;
    const clearTimeoutIfThere = () => {
        if (timeout) {
            clearTimeout(timeout);
        }
    };
    promise
        .then(() => {
            clearTimeoutIfThere();
        })
        .catch(() => {
            clearTimeoutIfThere();
        });

    return new Promise((resolve, reject) => {
        timeout = setTimeout(() => reject(error), ms);
    });
}
