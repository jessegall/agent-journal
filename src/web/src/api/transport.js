import {holdPressed} from "../platform/pressed.js";
import {covered} from "../state/updating.js";

const WAIT_MS = 20000;
const UPLOAD_WAIT_MS = 300000;
export const LONG_WAIT_MS = 600000;
const RELOAD_TRIES = 6;
const RELOAD_PAUSE_MS = 500;
const UPDATE_STATUS = "/journal/summary";
// Every call says it is the viewer's, so the journal knows a tab is open and a plugin's program or the shim never counts as one.
const VIEWER = {"X-Journal-Viewer": "1"};

export const asksUpdateStatus = (url) => url.split("?")[0].endsWith(UPDATE_STATUS);

const failure = (status, message) => Object.assign(new Error(message), {status});

export async function answered(response, fallback, failed = failure) {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(failed(response.status, body.error || fallback), {blocked: Boolean(body.blocked), details: body});
    return body;
}

const payload = (body) => (body === undefined || body instanceof FormData ? body : JSON.stringify(body));

class Transport {
    constructor() {
        this.flying = new Map();
        this.asked = new Map();
        this.written = () => {};
        this.refused = () => {};
        this.watcher = () => {};
        this.tries = RELOAD_TRIES;
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

    onBlocked(fn) {
        this.refused = fn;
    }

    async reach(method, url, body, wait, tries, headers = {}) {
        const raw = body instanceof FormData;
        try {
            return await fetch(url, {
                method,
                headers: {...VIEWER, ...headers, ...(body === undefined || raw ? {} : {"Content-Type": "application/json"})},
                body: payload(body),
                signal: AbortSignal.timeout(wait || (raw ? UPLOAD_WAIT_MS : WAIT_MS)),
            });
        } catch (error) {
            if (method !== "GET" || !(error instanceof TypeError) || tries <= 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, RELOAD_PAUSE_MS));
            return this.reach(method, url, body, wait, tries - 1, headers);
        }
    }

    async send(method, url, body, wait = 0, tries = RELOAD_TRIES, headers = {}) {
        this.watcher("sent", method, url, body);
        const release = method === "GET" ? () => {} : holdPressed();
        const res = await this.reach(method, url, body, wait, tries, headers).finally(() => {
            release();
            this.watcher("answered", method, url, body);
        });
        return answered(res, `${res.status} ${res.statusText}`).catch((error) => {
            if (error.blocked && method !== "GET") this.refused(error.message);
            throw error;
        });
    }

    request(method, url, body, wait = 0, headers = {}) {
        if (method !== "GET") return this.send(method, url, body, wait, RELOAD_TRIES, headers).then((got) => (this.written(url), got));
        if (covered() && !asksUpdateStatus(url))
            return Promise.reject(Object.assign(new Error("The journal is updating."), {updating: true}));
        const scope = Object.values(headers).join(" ");
        const key = `${scope} ${url}`;
        if (this.asked.has(key)) return this.asked.get(key);
        const endpoint = `${scope} ${url.split("?")[0]}`;
        const tries = this.tries;
        const call = (this.flying.get(endpoint) || Promise.resolve())
            .catch(() => {})
            .then(() => this.send(method, url, body, 0, tries, headers));
        this.flying.set(endpoint, call);
        this.asked.set(key, call);
        call.finally(() => {
            if (this.flying.get(endpoint) === call) this.flying.delete(endpoint);
            this.asked.delete(key);
        }).catch(() => {});
        return call;
    }
}

export const transport = new Transport();
