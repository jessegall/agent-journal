import {store} from "../src/state/store.js";
import {ui} from "../src/state/ui.js";
import {reactive} from "vue";
import {movesOf, stepSeconds} from "./pacing.js";
import {scenario} from "./scenarios.js";
import {QuietStream} from "./stream.js";

const SPEED = Number(new URLSearchParams(location.search).get("speed")) || 1;
const ENDING_AFTER = 2000;
const SLOWER = 2;

const LINES = {
    send: "Your turn: press Send to ask the agent",
    approve: "The plan is ready, press Approve",
    answer: "The agent asks you a question, pick the outlined answer",
};

const ANSWERS = {
    question: (row) => row.outcome,
    dump: (row) => row.data.answers.at(-1).answer,
};

export class Player {
    constructor(standIn) {
        this.standIn = standIn;
        this.timer = null;
        this.stepped = () => {};
        this.show = () => {};
        this.close = () => {};
        this.view = reactive({paused: false, slower: false, ended: false, finishing: false, looking: false, move: null});
        this.ending = null;
        this.moves = movesOf(this.standIn.moments).filter(Boolean);
        const first = this.waiting;
        if (first && this.standIn.state.at === 0) this.goTo(first.at - 1);
        this.play();
    }

    get line() {
        const {ended, finishing, paused, move} = this.view;
        if (ended) return "Lesson done";
        if (finishing) return "The agent is done";
        if (paused) return "Paused";
        return move ? LINES[move.kind] : `The agent is working, watch ${scenario.watch}`;
    }

    get waiting() {
        return this.moves.find((move) => move.at > this.standIn.state.at);
    }

    get playing() {
        return this.timer !== null || this.view.paused;
    }

    get finished() {
        return this.waiting === undefined && this.standIn.state.at >= this.standIn.moments.length - 1;
    }

    offer() {
        const move = this.waiting;
        ui.prefill = move && move.kind === "send" ? this.asked(move.at) : "";
        if (move && move.type === "dump") Object.assign(store, {pane: "chat", dumpSelected: move.n, dumping: true});
        if (move) this.close();
        this.view.move = move || null;
        this.view.finishing = this.finished;
        if (this.finished) this.ending ??= setTimeout(() => (this.view.ended = true), ENDING_AFTER);
    }

    asked(at) {
        const message = this.message(at);
        return message ? message.brief || message.title : "";
    }

    recorded(move) {
        const row = this.standIn.moments[move.at].rows[move.type].find((one) => one.n === move.n);
        return ANSWERS[move.type](row);
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
        if (kind === "answer" && how !== this.recorded(move)) return false;
        this.goTo(move.at);
        this.play();
        return true;
    }

    get filing() {
        return (this.standIn.moment.rows.dump || []).find((row) => !row.completed && !row.deleted) || null;
    }

    followDump(was) {
        const now = this.filing;
        if (now && now.n !== was?.n) Object.assign(store, {pane: "chat", dumpSelected: now.n, dumping: true});
        if (!now && was) store.dumping = false;
    }

    goTo(at) {
        const known = new Set(this.standIn.state.events.map((e) => e.id));
        const filing = this.filing;
        while (this.standIn.state.at < at && this.standIn.step());
        this.followDump(filing);
        this.standIn.state.events.filter((e) => !known.has(e.id)).forEach((e) => QuietStream.tell(this.standIn.dated(e)));
        this.showFresh(known);
        this.stepped();
    }

    showFresh(known) {
        const fresh = this.standIn.state.events.filter((e) => !known.has(e.id));
        fresh.forEach((e) => scenario.shows[`${e.type}.${e.action}`] && this.show(scenario.shows[`${e.type}.${e.action}`], e.n));
    }

    play() {
        clearTimeout(this.timer);
        this.timer = null;
        this.view.move = null;
        if (this.view.paused) return;
        const next = this.standIn.state.at + 1;
        const move = this.waiting;
        if (next >= this.standIn.moments.length || (move && move.at === next)) return this.offer();
        const seconds = stepSeconds(this.standIn.moments, next, scenario.subjects) * (this.view.slower ? SLOWER : 1);
        this.timer = setTimeout(
            () => {
                this.goTo(next);
                this.play();
            },
            (seconds * 1000) / SPEED
        );
    }

    pause() {
        this.view.paused = true;
        clearTimeout(this.timer);
        this.timer = null;
    }

    resume() {
        this.view.paused = false;
        this.play();
    }

    slow() {
        this.view.slower = !this.view.slower;
        if (this.timer !== null) this.play();
    }
}
