import {onPhone} from "../platform/phone.js";
import {SPINNER_AFTER_MS, holdPressed} from "../platform/pressed.js";
import {covered, serverGone} from "../state/updating.js";
import {JoinedRead} from "./joinedRead.js";
import {SHELL_WINDOW} from "../windows/shellWindow.js";
import {isViewerHidden} from "../windows/windowVisibility.js";

const WAIT_MS = 20000;
const READS_AT_ONCE = 4;
const READ_LINES_ROUTE = "/api/read-lines";
const READ_LINES_WAIT_MS = 5000;
const REFUSED_STATUS = 403;
const REPEATED_LINES_ROUTE = "/api/repeated-lines";
const REPEATED_LINES = 10;
const REPEATED_LINES_WITHIN_MS = 2000;
const UPLOAD_WAIT_MS = 300000;
export const LONG_WAIT_MS = 600000;
// tells the server the asking windows are hidden, so their polls wait at background
export const HIDDEN_WINDOW_HEADER = "X-Journal-Window-Hidden";
const RELOAD_TRIES = 6;
const RELOAD_PAUSE_MS = 500;
const UPDATE_STATUS = "/journal/summary";
const SERVER_STATE = "/api/server-state";
const SERVER_STATE_WAIT_MS = 20000;
// Every call says it is the viewer's, so the journal knows a tab is open and a plugin's program or the shim never counts as one.
// the viewer names itself so the journal knows the desk is open; the phone names itself so its writes are trusted
const VIEWER = onPhone ? {"X-Phone": "1"} : {"X-Journal-Viewer": "1"};

const asksUpdateStatus = (url) => url.split("?")[0].endsWith(UPDATE_STATUS);

const failure = (status, message) => Object.assign(new Error(message), {status});

async function answered(response, fallback, failed = failure) {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(failed(response.status, body.error || fallback), {blocked: Boolean(body.blocked), details: body});
    return body;
}

const payload = (body) => (body === undefined || body instanceof FormData ? body : JSON.stringify(body));

const limited = (signal, milliseconds) => AbortSignal.any([AbortSignal.timeout(milliseconds), ...(signal ? [signal] : [])]);

const nounAndVerb = (line) => line.split(" ").slice(0, 2).join(" ");

// the state of a stream the journal closed, as an EventSource reports it
export const STREAM_CLOSED = 2;

// what a request does: a read may be joined and waits its turn, a write never is and never does, and a stream stays open
export const READ = "read";
export const WRITE = "write";
export const STREAM = "stream";

// the one file that makes a request: every fetch and event stream of the viewer leaves here and is in its table while it flies, under the window that asked
// the browser allows six connections to one host: the event stream takes one and reads take four at most, so a write always finds one free
class Transport {
    constructor() {
        this.joinedReads = new Map();
        this.flights = new Set();
        this.lineCounts = new Map();
        this.httpCounts = new Map();
        this.httpRequests = 0;
        this.joinCounts = new Map();
        this.clientId = crypto.randomUUID();
        this.recording = false;
        this.readReceipts = [];
        this.receiptTimer = null;
        this.receiptSending = Promise.resolve();
        this.receiptFailures = 0;
        this.recentLines = new Map();
        this.reportedLines = new Set();
        this.readsFlying = 0;
        this.readsWaiting = [];
        this.readLines = null;
        this.knownReads = null;
        this.written = () => {};
        this.refused = () => {};
        this.watcher = () => {};
        this.tries = RELOAD_TRIES;
    }

    // what is in flight, of one window or of all: each with its window, line, kind (read, write or stream), address and started_at
    inFlight(window = null) {
        return [...this.flights].filter((flight) => window === null || flight.window === window).map((flight) => ({...flight}));
    }

    // how many requests a window has sent, by term and verb
    sentCounts(window) {
        return Object.fromEntries(this.lineCounts.get(window) ?? []);
    }

    requestCounts(window) {
        const sent = this.sentCounts(window);
        const joins = [...(this.joinCounts.get(window)?.values() ?? [])];
        return {http_requests: this.httpCounts.get(window) ?? 0,
            logical_commands: Object.entries(sent).filter(([line]) => !line.startsWith("/")).reduce((sum, [, count]) => sum + count, 0),
            joined_callers: joins.reduce((sum, count) => sum + count.joined_callers, 0),
            trailing_reads: joins.reduce((sum, count) => sum + count.trailing_reads, 0), by_command: sent};
    }

    requestTotals() {
        const windows = [...this.lineCounts.keys()].map((window) => this.requestCounts(window));
        return {http_requests: this.httpRequests,
            logical_commands: windows.reduce((sum, count) => sum + count.logical_commands, 0),
            joined_callers: windows.reduce((sum, count) => sum + count.joined_callers, 0),
            trailing_reads: windows.reduce((sum, count) => sum + count.trailing_reads, 0)};
    }

    took(requests, url) {
        if (/\/api\/lines?$/.test(url)) {
            this.httpRequests += 1;
            new Set(requests.map((request) => request.window)).forEach((window) => this.httpCounts.set(window, (this.httpCounts.get(window) ?? 0) + 1));
        }
        const started_at = Date.now();
        const flights = requests.map((request) => ({...request, url, started_at}));
        flights.forEach((flight) => {
            this.flights.add(flight);
            this.counted(flight);
        });
        return () => flights.forEach((flight) => this.flights.delete(flight));
    }

    counted({window, line}) {
        const counts = this.lineCounts.get(window) ?? new Map();
        const asked = nounAndVerb(line);
        counts.set(asked, (counts.get(asked) ?? 0) + 1);
        this.lineCounts.set(window, counts);
        this.noticeRepeatedLines(window, asked, line);
    }

    // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
    noticeRepeatedLines(window, asked, line) {
        const key = `${window} ${asked}`;
        const now = Date.now();
        const recent = new Map([...(this.recentLines.get(key) ?? [])].filter(([, at]) => now - at < REPEATED_LINES_WITHIN_MS));
        recent.set(line, now);
        this.recentLines.set(key, recent);
        if (recent.size < REPEATED_LINES || this.reportedLines.has(key)) return;
        this.reportedLines.add(key);
        const body = JSON.stringify({window, line: asked, count: recent.size});
        this.out(REPEATED_LINES_ROUTE, {method: "POST", headers: {...VIEWER, "Content-Type": "application/json"}, body}, [{window: SHELL_WINDOW, line: REPEATED_LINES_ROUTE, kind: WRITE}]).catch(() => {});
    }

    // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
    // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
    // a read shows the spinner after a short wait, a write at once
    held(ask, read = false) {
        const release = holdPressed(read ? SPINNER_AFTER_MS : 0);
        try {
            return ask().finally(release);
        } catch (error) {
            release();
            throw error;
        }
    }

    // the one place a request leaves
    async out(url, init, requests, limit = 0) {
        const landed = this.took(requests, url);
        const told = {...init, headers: {...(init.headers || {}), [HIDDEN_WINDOW_HEADER]: isViewerHidden() ? "1" : "0"}};
        const leaving = limit ? {...told, signal: limited(init.signal, limit)} : told;
        try {
            return await fetch(url, requests[0].kind === WRITE ? {...leaving, priority: "high"} : leaving);
        } finally {
            landed();
        }
    }

    // a request that fails to reach the server puts the cover up
    async sent(url, init, requests, limit = WAIT_MS) {
        try {
            return await this.out(url, init, requests, limit);
        } catch (error) {
            if (error instanceof TypeError) serverGone();
            throw error;
        }
    }

    // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
    async whenFree(leave) {
        if (this.readsFlying >= READS_AT_ONCE) await new Promise((resolve) => this.readsWaiting.push(resolve));
        else this.readsFlying += 1;
        try {
            return await leave();
        } finally {
            const next = this.readsWaiting.shift();
            if (next) next();
            else this.readsFlying -= 1;
        }
    }

    // whether a line only reads, as the server knows its command: a line the server has not called a read is a write, which is never joined
    async isRead(words) {
        this.readLines ??= this.answeredReadLines();
        this.knownReads = await this.readLines;
        return this.knownReads.has(words.slice(0, 2).join(" "));
    }

    // the same, at once and without asking: a line is taken for a write until the server's list of reads has come
    knownRead(words) {
        return Boolean(this.knownReads?.has(words.slice(0, 2).join(" ")));
    }

    answeredReadLines() {
        return this.out(READ_LINES_ROUTE, {headers: VIEWER}, [{window: SHELL_WINDOW, line: READ_LINES_ROUTE, kind: READ}], READ_LINES_WAIT_MS)
            .then(async (response) => {
                // a share link is refused the list and sends every line as a write; any other failure asks again at the next line
                if (response.status === REFUSED_STATUS) return new Set();
                if (!response.ok) throw failure(response.status, "The read lines did not answer");
                const answer = await response.json();
                this.recording = answer.recording === true;
                return new Set(answer.reads);
            })
            .catch(() => {
                this.readLines = null;
                return new Set();
            });
    }

    // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
    joined(key, read, signal = undefined, identity = null) {
        const joined = this.joinedReads.get(key) ?? new JoinedRead(
            (stop, run) => read(stop, identity ? this.readAttribution(run) : undefined),
            () => this.joinedReads.delete(key),
            (event, run) => { if (identity) this.trackRead(identity, event, run); });
        this.joinedReads.set(key, joined);
        return joined.asked(signal);
    }

    readAttribution(run) {
        return {client_id: this.clientId, command_id: run.id, joined_callers: run.callers - 1,
            followed_command_id: run.trailingOf, complete: false};
    }

    trackRead({window, line}, event, run) {
        const counts = this.joinCounts.get(window) ?? new Map();
        const command = nounAndVerb(line.join(" "));
        const count = counts.get(command) ?? {joined_callers: 0, trailing_reads: 0};
        if (event === "asked" && run.callers > 1) count.joined_callers += 1;
        if (event === "sent" && run.trailingOf) count.trailing_reads += 1;
        counts.set(command, count);
        this.joinCounts.set(window, counts);
        if (event !== "answered" || !this.recording) return;
        this.readReceipts.push(this.readAttribution(run));
        this.receiptTimer ??= setTimeout(() => this.flushReadReceipts(), 50);
    }

    flushReadReceipts() {
        clearTimeout(this.receiptTimer);
        this.receiptTimer = null;
        const receipts = this.readReceipts;
        this.readReceipts = [];
        if (!receipts.length) return this.receiptSending;
        this.receiptSending = this.receiptSending.then(async () => {
            try {
                const response = await this.raw("/api/read-receipts", {method: "POST", headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({receipts})});
                if (!response.ok) this.receiptFailures += receipts.length;
            } catch {
                this.receiptFailures += receipts.length;
            }
        });
        return this.receiptSending;
    }

    // an event has come: a read in flight may be older than it, so whoever asks that read from now on gets one that runs after it
    readsOutdated() {
        this.joinedReads.forEach((joined) => joined.heardEvent());
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
        const init = {method, headers: {...VIEWER, ...headers, ...(body === undefined || raw ? {} : {"Content-Type": "application/json"})}, body: payload(body)};
        const limit = wait || (raw ? UPLOAD_WAIT_MS : WAIT_MS);
        try {
            if (method === "GET") return await this.whenFree(() => this.sent(url, init, [{window: SHELL_WINDOW, line: url, kind: READ}], limit));
            return await this.sent(url, init, [{window: SHELL_WINDOW, line: url, kind: WRITE}], limit);
        } catch (error) {
            if (method !== "GET" || !(error instanceof TypeError) || tries <= 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, RELOAD_PAUSE_MS));
            return this.reach(method, url, body, wait, tries - 1, headers);
        }
    }

    async send(method, url, body, wait = 0, tries = RELOAD_TRIES, headers = {}) {
        this.watcher("sent", method, url, body);
        const res = await this.reach(method, url, body, wait, tries, headers).finally(() => {
            this.watcher("answered", method, url, body);
        });
        return answered(res, `${res.status} ${res.statusText}`).catch((error) => {
            if (error.blocked && method !== "GET") this.refused(error.message);
            throw error;
        });
    }

    // a read whose failure says nothing about the server, so it puts no cover up
    quietRead(url, init = {}) {
        return this.held(() => this.whenFree(() => this.out(url, init, [{window: SHELL_WINDOW, line: url, kind: READ}], WAIT_MS)), true);
    }

    // a file's bytes, which are not JSON, at an address that names its environment itself
    async bytes(url) {
        const res = await this.quietRead(url, {headers: VIEWER});
        if (!res.ok) throw failure(res.status, `The file could not be read: ${res.status} ${res.statusText}`);
        return res.arrayBuffer();
    }

    // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
    // sent, and its caller takes the answer of the one in flight
    request(method, url, body, wait = 0, headers = {}, key = url.split("?")[0]) {
        return this.held(() => this.asked(method, url, body, wait, headers, key), method === "GET");
    }

    asked(method, url, body, wait, headers, key) {
        if (method !== "GET") return this.send(method, url, body, wait, RELOAD_TRIES, headers).then((got) => (this.written(url), got));
        if (covered() && !asksUpdateStatus(url))
            return Promise.reject(Object.assign(new Error("The journal is updating."), {updating: true}));
        return this.joined(key, () => this.send(method, url, body, 0, this.tries, headers));
    }

    // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
    stream(url) {
        const landed = this.took([{window: SHELL_WINDOW, line: url, kind: STREAM}], url);
        const source = new EventSource(url);
        const close = source.close;
        source.close = () => {
            landed();
            close.call(source);
        };
        return source;
    }

    // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
    serverState() {
        return this.out(SERVER_STATE, {cache: "no-store"}, [{window: SHELL_WINDOW, line: SERVER_STATE, kind: READ}], SERVER_STATE_WAIT_MS);
    }

    // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
    // how long a read may take; a request the server never answered puts the cover up
    raw(url, init = {}, {window = SHELL_WINDOW, line = url, limit = WAIT_MS} = {}) {
        const kind = (init.method ?? "GET") === "GET" ? READ : WRITE;
        if (kind === WRITE) return this.held(() => this.sent(url, init, [{window, line, kind}], 0));
        return this.held(() => this.whenFree(() => this.sent(url, init, [{window, line, kind}], limit)), true);
    }
}

const SHARED = Symbol.for("journal.transport");

// the shell and the window kit are built apart and each carries this file: they share the one transport, so its table and limits are the page's
export const transport = (globalThis[SHARED] ??= new Transport());
