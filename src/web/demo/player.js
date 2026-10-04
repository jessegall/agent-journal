import {ui} from "../src/state/ui.js";
import {QuietStream} from "./stream.js";

const SPEED = Number(new URLSearchParams(location.search).get("speed")) || 1;
const LONGEST = 5;
const SHORTEST = 0.3;
const MOVES = [
    ["send", (e) => e.type === "message" && e.action === "created"],
    ["approve", (e) => e.type === "plan" && e.action === "updated" && e.data.by === "approve"],
    ["answer", (e) => e.type === "question" && e.action === "completed"],
];

const newest = (moment) => Math.max(0, ...(moment.events || []).map((e) => e.id));

function moveIn(moment, before) {
    const fresh = (moment.events || []).filter((e) => e.id > newest(before) && e.actor === "user");
    for (const [kind, is] of MOVES) {
        const event = fresh.find(is);
        if (event) return {kind, n: event.n};
    }
    return null;
}

function movesOf(moments) {
    return moments.map((moment, at) => (at > 0 ? moveIn(moment, moments[at - 1]) : null)).map((move, at) => move && {...move, at});
}

export class Player {
    constructor(standIn) {
        this.standIn = standIn;
        this.timer = null;
        this.stepped = () => {};
        this.mapped();
        const first = this.waiting;
        if (first && this.standIn.state.at === 0) this.goTo(first.at - 1);
        this.play();
    }

    mapped() {
        this.moves = movesOf(this.standIn.moments).filter(Boolean);
        const branches = Object.values(this.standIn.demo.branches || {});
        const opening =
            branches.length && !this.standIn.state.branch && movesOf([this.standIn.demo.moments.at(-1), ...branches[0]]).find(Boolean);
        this.fork = opening ? {...opening, at: this.standIn.moments.length, fork: true} : null;
    }

    get waiting() {
        return this.moves.find((move) => move.at > this.standIn.state.at) || this.fork || undefined;
    }

    get playing() {
        return this.timer !== null;
    }

    get finished() {
        return this.waiting === undefined && this.standIn.state.at >= this.standIn.moments.length - 1;
    }

    offer() {
        const move = this.waiting;
        ui.prefill = move && move.kind === "send" ? this.asked(move.at) : "";
    }

    asked(at) {
        const message = this.message(at);
        return message ? message.brief || message.title : "";
    }

    message(at) {
        const before = this.standIn.moments[at - 1];
        const known = new Set(((before && before.rows.message) || []).map((r) => r.n));
        return (this.standIn.moments[at].rows.message || []).find((r) => !known.has(r.n) && (r.seen || [])[0] === "user");
    }

    send() {
        const move = this.waiting;
        if (!move || move.kind !== "send") return null;
        ui.prefill = "";
        this.goTo(move.at);
        this.play();
        return this.message(move.at);
    }

    moved(kind, n, how) {
        const move = this.waiting;
        if (!move || move.kind !== kind || move.n !== n) return false;
        if (move.fork && !this.standIn.branched(how)) return false;
        if (move.fork) this.mapped();
        this.goTo(this.waiting.at);
        this.play();
        return true;
    }

    goTo(at) {
        const known = new Set(this.standIn.state.events.map((e) => e.id));
        while (this.standIn.state.at < at && this.standIn.step());
        this.standIn.state.events.filter((e) => !known.has(e.id)).forEach((e) => QuietStream.tell(this.standIn.dated(e)));
        this.stepped();
    }

    play() {
        clearTimeout(this.timer);
        this.timer = null;
        const next = this.standIn.state.at + 1;
        const move = this.waiting;
        if (next >= this.standIn.moments.length || (move && move.at === next)) return this.offer();
        const gap = this.standIn.moments[next].at - this.standIn.moment.at;
        this.timer = setTimeout(
            () => {
                this.goTo(next);
                this.play();
            },
            (Math.min(LONGEST, Math.max(SHORTEST, gap)) * 1000) / SPEED
        );
    }
}
