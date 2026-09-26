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
    }

    watch(fn) {
        this.watcher = fn;
    }

    onWrite(fn) {
        this.written = fn;
    }

    async reach(method, url, body, wait, tries) {
        const raw = body instanceof FormData;
        try {
            return await fetch(url, {
                method,
                headers: body === undefined || raw ? {} : {"Content-Type": "application/json"},
                body: body === undefined || raw ? body : JSON.stringify(body),
                signal: AbortSignal.timeout(wait || (raw ? UPLOAD_WAIT_MS : method === "GET" ? READ_WAIT_MS : WAIT_MS)),
            });
        } catch (error) {
            if (method !== "GET" || !(error instanceof TypeError) || tries <= 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, RELOAD_PAUSE_MS));
            return this.reach(method, url, body, wait, tries - 1);
        }
    }

    async send(method, url, body, wait = 0) {
        this.watcher("sent", method, url, body);
        const res = await this.reach(method, url, body, wait, RELOAD_TRIES).finally(() => this.watcher("answered", method, url, body));
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
