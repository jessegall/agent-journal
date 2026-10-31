import {onPhone} from "../platform/phone.js";
import {holdPressed} from "../platform/pressed.js";
import {covered} from "../state/updating.js";

const WAIT_MS = 20000;
const UPLOAD_WAIT_MS = 300000;
export const LONG_WAIT_MS = 600000;
const RELOAD_TRIES = 6;
const RELOAD_PAUSE_MS = 500;
const UPDATE_STATUS = "/journal/summary";
// Every call says it is the viewer's, so the journal knows a tab is open and a plugin's program or the shim never counts as one.
// the viewer names itself so the journal knows the desk is open; the phone names itself so its writes are trusted
const VIEWER = onPhone ? {"X-Phone": "1"} : {"X-Journal-Viewer": "1"};

export const asksUpdateStatus = (url) => url.split("?")[0].endsWith(UPDATE_STATUS);

const failure = (status, message) => Object.assign(new Error(message), {status});

export async function answered(response, fallback, failed = failure) {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(failed(response.status, body.error || fallback), {blocked: Boolean(body.blocked), details: body});
    return body;
}

const payload = (body) => (body === undefined || body instanceof FormData ? body : JSON.stringify(body));

// the state of a stream the journal closed, as an EventSource reports it
export const STREAM_CLOSED = 2;

class Transport {
    constructor() {
        this.flying = new Map();
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

    // a file's bytes, which are not JSON, at an address that names its environment itself
    async bytes(url) {
        const res = await fetch(url, {headers: VIEWER, signal: AbortSignal.timeout(WAIT_MS)});
        if (!res.ok) throw failure(res.status, `The file could not be read: ${res.status} ${res.statusText}`);
        return res.arrayBuffer();
    }

    // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
    // sent, and its caller takes the answer of the one in flight
    request(method, url, body, wait = 0, headers = {}, key = url.split("?")[0]) {
        if (method !== "GET") return this.send(method, url, body, wait, RELOAD_TRIES, headers).then((got) => (this.written(url), got));
        if (covered() && !asksUpdateStatus(url))
            return Promise.reject(Object.assign(new Error("The journal is updating."), {updating: true}));
        if (this.flying.has(key)) return this.flying.get(key);
        const call = this.send(method, url, body, 0, this.tries, headers);
        this.flying.set(key, call);
        call.finally(() => this.flying.delete(key)).catch(() => {});
        return call;
    }

    // the stream of the journal's entries, which an address names whole, its environment in its query
    stream(url) {
        return new EventSource(url);
    }

    // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
    // as the browser's own response
    raw(url, init = {}) {
        return fetch(url, init);
    }
}

export const transport = new Transport();
