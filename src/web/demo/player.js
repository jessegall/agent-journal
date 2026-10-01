import {store} from "../src/state/store.js";
import {QuietStream} from "./stream.js";

const SPEED = Number(new URLSearchParams(location.search).get("speed")) || 1;
const LONGEST = 4;
const SHORTEST = 0.35;
const OPENING = 1200;

const newest = (moment) => Math.max(0, ...(moment.events || []).map((e) => e.id));
const asks = (moment, before) =>
    (moment.events || []).some((e) => e.id > newest(before) && e.type === "message" && e.action === "created" && e.actor === "user");

export class Player {
    constructor(standIn) {
        this.standIn = standIn;
        const moments = standIn.demo.moments;
        this.prompts = moments.map((moment, at) => (at > 0 && asks(moment, moments[at - 1]) ? at : -1)).filter((at) => at > 0);
        this.timer = null;
        if (standIn.state.at > 0) return this.offer();
        this.timer = setTimeout(() => this.send(), OPENING / SPEED);
    }

    get waiting() {
        return this.prompts.find((at) => at > this.standIn.state.at);
    }

    get playing() {
        return this.timer !== null;
    }

    get finished() {
        return this.waiting === undefined && this.standIn.state.at >= this.standIn.demo.moments.length - 1;
    }

    offer() {
        const at = this.waiting;
        store.prefill = at === undefined ? "" : this.asked(at);
    }

    asked(at) {
        const message = this.message(at);
        return message ? message.brief || message.title : "";
    }

    message(at) {
        const before = this.standIn.demo.moments[at - 1];
        const known = new Set(((before && before.rows.message) || []).map((r) => r.n));
        return (this.standIn.demo.moments[at].rows.message || []).find((r) => !known.has(r.n) && (r.seen || [])[0] === "user");
    }

    send() {
        const at = this.waiting;
        if (at === undefined) return null;
        store.prefill = "";
        this.goTo(at);
        this.play();
        return this.message(at);
    }

    goTo(at) {
        const known = new Set(this.standIn.state.events.map((e) => e.id));
        while (this.standIn.state.at < at && this.standIn.step());
        this.standIn.state.events.filter((e) => !known.has(e.id)).forEach((e) => QuietStream.tell(this.standIn.dated(e)));
    }

    play() {
        clearTimeout(this.timer);
        this.timer = null;
        const next = this.standIn.state.at + 1;
        if (next >= this.standIn.demo.moments.length || this.prompts.includes(next)) return this.offer();
        const gap = this.standIn.demo.moments[next].at - this.standIn.moment.at;
        this.timer = setTimeout(
            () => {
                this.goTo(next);
                this.play();
            },
            (Math.min(LONGEST, Math.max(SHORTEST, gap)) * 1000) / SPEED
        );
    }
}
