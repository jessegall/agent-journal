import {READ, WRITE, transport} from "../api/transport.js";

const WAIT_MS = 0;
const LINES_ROUTE = "/api/lines";
const LINE_ROUTE = "/api/line";
const BATCH_WAIT_MS = 5000;

const init = (body, signal) => ({signal, method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)});
const flightOf = (body, kind) => ({window: body.window, line: body.line.join(" "), kind});
const slowKey = (body) => JSON.stringify(body.line);
const cancelled = () => new DOMException("cancelled", "AbortError");

// reads asked while none can leave go together in one request, answered in order; a read asked alone goes alone
// a batch given no answer in time is given up and each of its lines goes alone, so a stuck line holds only itself; that line goes alone from then on, until it answers quickly again
// a write always goes alone and at once, whatever the reads do
export class LineBatch {
    constructor() {
        this.waiting = [];
        this.timer = null;
        this.slow = new Set();
    }

    read(body, signal, unbatched = false) {
        return new Promise((resolve, reject) => {
            const entry = {body, signal, resolve, reject};
            if (unbatched || this.slow.has(slowKey(body))) {
                transport.whenFree(() => this.readAlone(entry));
                return;
            }
            this.waiting.push(entry);
            this.sendSoon();
        });
    }

    // a write always finishes, also when its window has gone: it carries no signal
    write(body) {
        return new Promise((resolve, reject) => this.alone({body, resolve, reject}, WRITE));
    }

    sendSoon() {
        this.timer ??= setTimeout(() => transport.whenFree(() => this.send()), WAIT_MS);
    }

    async send() {
        const sending = this.waiting.filter((entry) => !entry.signal?.aborted);
        this.waiting.filter((entry) => entry.signal?.aborted).forEach((entry) => entry.reject(cancelled()));
        this.waiting = [];
        this.timer = null;
        if (sending.length === 1) return this.readAlone(sending[0]);
        if (!sending.length) return undefined;
        await this.sendTogether(sending);
        return undefined;
    }

    // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
    async sendTogether(sending) {
        const cut = new AbortController();
        const waiting = new Set(sending);
        const leavers = sending.map((entry) => () => {
            waiting.delete(entry);
            entry.reject(cancelled());
            cut.abort();
        });
        sending.forEach((entry, index) => entry.signal?.addEventListener("abort", leavers[index], {once: true}));
        try {
            const response = await transport.sent(LINES_ROUTE, init({lines: sending.map((entry) => entry.body)}, cut.signal), sending.map((entry) => flightOf(entry.body, READ)), BATCH_WAIT_MS);
            if (!response.ok) throw new Error(`the journal answered ${response.status} to a batch of lines`);
            const {answers} = await response.json();
            sending.forEach((entry, index) => entry.resolve(answers[index]));
        } catch (failure) {
            if (cut.signal.aborted) {
                this.waiting.push(...waiting);
                if (waiting.size) this.sendSoon();
            } else if (failure.name === "TimeoutError") sending.forEach((entry) => transport.whenFree(() => this.readAlone(entry)));
            else sending.forEach((entry) => entry.reject(failure));
        } finally {
            sending.forEach((entry, index) => entry.signal?.removeEventListener("abort", leavers[index]));
        }
    }

    async readAlone(entry) {
        const startedAt = Date.now();
        await this.alone(entry, READ);
        if (Date.now() - startedAt < BATCH_WAIT_MS) this.slow.delete(slowKey(entry.body));
        else this.slow.add(slowKey(entry.body));
    }

    async alone(entry, kind) {
        try {
            const response = await transport.sent(LINE_ROUTE, init(entry.body, entry.signal), [flightOf(entry.body, kind)], kind === READ ? undefined : 0);
            entry.resolve(await response.json());
        } catch (failure) {
            entry.reject(failure);
        }
    }
}

export const lineBatch = new LineBatch();
