const WAIT_MS = 20000;
const READ_WAIT_MS = 5000;
const UPLOAD_WAIT_MS = 300000;
export const LONG_WAIT_MS = 600000;
const RELOAD_TRIES = 6;
const RELOAD_PAUSE_MS = 500;

class Transport {
    constructor() {
        this.flying = new Map();
        this.asked = new Map();
        this.written = () => {};
        this.watcher = () => {};
        this.health = () => {};
        this.tokens = new Map();
    }

    onHealth(fn) {
        this.health = fn;
    }

    watch(fn) {
        this.watcher = fn;
    }

    onWrite(fn) {
        this.written = fn;
    }

    token(url) {
        const origin = new URL(url, location.origin).origin;
        if (!this.tokens.has(origin)) {
            const request = fetch(`${origin}/api/session-token`, {cache: "no-store"})
                .then((response) => {
                    if (!response.ok) throw new Error("The journal did not grant this page write access");
                    return response.json();
                })
                .then((body) => body.token)
                .catch((error) => {
                    this.tokens.delete(origin);
                    throw error;
                });
            this.tokens.set(origin, request);
        }
        return this.tokens.get(origin);
    }

    async reach(method, url, body, wait, tries) {
        const raw = body instanceof FormData;
        try {
            const headers = body === undefined || raw ? {} : {"Content-Type": "application/json"};
            if (method === "POST") headers["X-Journal-Token"] = await this.token(url);
            return await fetch(url, {
                method,
                headers,
                body: body === undefined || raw ? body : JSON.stringify(body),
                signal: AbortSignal.timeout(wait || (raw ? UPLOAD_WAIT_MS : method === "GET" ? READ_WAIT_MS : WAIT_MS)),
            });
        } catch (error) {
            const unreached = error instanceof TypeError || error.name === "TimeoutError";
            if (method !== "GET" || !(error instanceof TypeError) || tries <= 1) {
                if (unreached && new URL(url, location.origin).origin === location.origin) this.health(false);
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, RELOAD_PAUSE_MS));
            return this.reach(method, url, body, wait, tries - 1);
        }
    }

    async send(method, url, body, wait = 0) {
        this.watcher("sent", method, url, body);
        const res = await this.reach(method, url, body, wait, RELOAD_TRIES)
            .then(async (response) => {
                if (method !== "POST" || response.status !== 403) return response;
                this.tokens.delete(new URL(url, location.origin).origin);
                return this.reach(method, url, body, wait, RELOAD_TRIES);
            })
            .finally(() => this.watcher("answered", method, url, body));
        if (new URL(url, location.origin).origin === location.origin) this.health(true);
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || `${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    request(method, url, body, wait = 0) {
        if (method !== "GET") return this.send(method, url, body, wait).then((got) => (this.written(url), got));
        if (this.asked.has(url)) return this.asked.get(url);
        const endpoint = url.split("?")[0];
        const call = (this.flying.get(endpoint) || Promise.resolve()).catch(() => {}).then(() => this.send(method, url, body));
        this.flying.set(endpoint, call);
        this.asked.set(url, call);
        call.finally(() => {
            if (this.flying.get(endpoint) === call) this.flying.delete(endpoint);
            this.asked.delete(url);
        }).catch(() => {});
        return call;
    }
}

export const transport = new Transport();
