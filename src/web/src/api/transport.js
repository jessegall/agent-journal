const WAIT_MS = 20000;
const UPLOAD_WAIT_MS = 300000;

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

    async send(method, url, body) {
        const raw = body instanceof FormData;
        this.watcher("sent", method, url, body);
        const res = await fetch(url, {
            method,
            headers: body === undefined || raw ? {} : {"Content-Type": "application/json"},
            body: body === undefined || raw ? body : JSON.stringify(body),
            signal: AbortSignal.timeout(raw ? UPLOAD_WAIT_MS : WAIT_MS),
        }).finally(() => this.watcher("answered", method, url, body));
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || `${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    request(method, url, body) {
        if (method !== "GET") return this.send(method, url, body).then((got) => (this.written(url), got));
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
