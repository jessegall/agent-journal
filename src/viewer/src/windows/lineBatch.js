import {transport} from "../api/transport.js";

const WAIT_MS = 0;
const LINES_ROUTE = "/api/lines";
const LINE_ROUTE = "/api/line";

// lines asked in the same moment, before the browser takes its next turn, go in one request and are answered in order; one alone goes as it always did
export class LineBatch {
    constructor() {
        this.waiting = [];
        this.timer = null;
    }

    add(body, signal) {
        return new Promise((resolve, reject) => {
            this.waiting.push({body, signal, resolve, reject});
            this.timer ??= setTimeout(() => this.send(), WAIT_MS);
        });
    }

    async send() {
        const sending = this.waiting.filter((entry) => !entry.signal?.aborted);
        this.waiting.filter((entry) => entry.signal?.aborted).forEach((entry) => entry.reject(new DOMException("cancelled", "AbortError")));
        this.waiting = [];
        this.timer = null;
        if (sending.length === 1) return this.alone(sending[0]);
        if (!sending.length) return undefined;
        try {
            const response = await transport.raw(LINES_ROUTE, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({lines: sending.map((entry) => entry.body)})});
            const {answers} = await response.json();
            sending.forEach((entry, index) => entry.resolve(answers[index]));
        } catch (failure) {
            sending.forEach((entry) => entry.reject(failure));
        }
        return undefined;
    }

    async alone(entry) {
        try {
            const response = await transport.raw(LINE_ROUTE, {signal: entry.signal, method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(entry.body)});
            entry.resolve(await response.json());
        } catch (failure) {
            entry.reject(failure);
        }
    }
}

export const lineBatch = new LineBatch();
