class Transport {
    constructor() {
        this.flying = new Map();
        this.asked = new Map();
        this.written = () => {};
    }

    onWrite(fn) {
        this.written = fn;
    }

    async send(method, url, body) {
        const raw = body instanceof FormData;
        const res = await fetch(url, {
            method,
            headers: body === undefined || raw ? {} : {"Content-Type": "application/json"},
            body: body === undefined || raw ? body : JSON.stringify(body),
        });
        const got = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(got.error || `${res.status} ${res.statusText}`);
        return got;
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
