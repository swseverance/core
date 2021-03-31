class Storage {
    public readonly LAST_SESSION_KEY = "lastSession";

    public get(key: string) {
        return JSON.parse(sessionStorage.getItem(key));
    }

    public set(key: string, value: object) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}

export default new Storage();
