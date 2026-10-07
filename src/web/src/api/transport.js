const WAIT_MS = 20000;
const UPLOAD_WAIT_MS = 300000;
export const LONG_WAIT_MS = 600000;
const RELOAD_TRIES = 6;
const RELOAD_PAUSE_MS = 500;
const LOCKED = 428;

const failure = (status, message) => Object.assign(new Error(message), {status});

export async function answered(response, fallback, failed = failure) {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw failed(response.status, body.error || fallback);
    return body;
}

const payload = (body) => (body === undefined || body instanceof FormData ? body : JSON.stringify(body));

class Transport {
    constructor() {
        this.flying = new Map();
        this.asked = new Map();
        this.written = () => {};
        this.watcher = () => {};
        this.tries = RELOAD_TRIES;
        this.carried = {};
        this.unlocker = null;
    }

    unlockWith(fn) {
        this.unlocker = fn;
    }

    carry(headers) {
        this.carried = headers;
    }

    attemptOnce(ask) {
        this.tries = 1;
        try {
            return ask();
        } finally {
            this.tries = RELOAD_TRIES;
        }
    }

    watch(fn) {
        this.watcher = fn;
    }

    onWrite(fn) {
        this.written = fn;
    }

    async reach(method, url, body, wait, tries, unlocked = {}) {
        const raw = body instanceof FormData;
        try {
            return await fetch(url, {
                method,
                headers: {...this.carried, ...unlocked, ...(body === undefined || raw ? {} : {"Content-Type": "application/json"})},
                body: payload(body),
                signal: AbortSignal.timeout(wait || (raw ? UPLOAD_WAIT_MS : WAIT_MS)),
            });
        } catch (error) {
            if (method !== "GET" || !(error instanceof TypeError) || tries <= 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, RELOAD_PAUSE_MS));
            return this.reach(method, url, body, wait, tries - 1, unlocked);
        }
    }

    async send(method, url, body, wait = 0, tries = RELOAD_TRIES) {
        this.watcher("sent", method, url, body);
        const res = await this.reach(method, url, body, wait, tries)
            .then((got) => (got.status === LOCKED && this.unlocker ? this.unlockedReach(method, url, body, wait, tries) : got))
            .finally(() => this.watcher("answered", method, url, body));
        return answered(res, `${res.status} ${res.statusText}`);
    }

    async unlockedReach(method, url, body, wait, tries) {
        return this.reach(method, url, body, wait, tries, await this.unlocker(method, url, payload(body)));
    }

    request(method, url, body, wait = 0) {
        if (method !== "GET") return this.send(method, url, body, wait).then((got) => (this.written(url), got));
        if (this.asked.has(url)) return this.asked.get(url);
        const endpoint = url.split("?")[0];
        const tries = this.tries;
        const call = (this.flying.get(endpoint) || Promise.resolve()).catch(() => {}).then(() => this.send(method, url, body, 0, tries));
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
