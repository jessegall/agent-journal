import {createApp, h, nextTick, reactive} from "vue";
import {beforeEach, describe, expect, test} from "vitest";
import WaitEdge from "../src/kit/WaitEdge.vue";
import {lineOf, stateOf, waitingFor, waitingOn, wordOf} from "../src/domain/agentState.js";
import {phoneWaiting} from "../src/phone/agentWait.js";

const flush = async () => {
    for (let i = 0; i < 5; i++) await nextTick();
};
const NOW = 1_000_000;
const work = (data = {}) => ({n: 1, title: "Check", completed: 0, data: {awaiting: "the test suite", awaiting_since: NOW - 240, ...data}});
const agent = (status = "idle") => ({data: {status}});
const helper = (n, state) => ({n, state, data: {name: `Helper ${n}`}});

describe("the waiting word and its line", () => {
    test("an idle agent that waits on helpers says Waiting, how many helpers and how long", () => {
        const works = [work({awaiting: "3 helpers", awaiting_on: "helper:1,helper:2,helper:3"})];
        const helpers = [helper(1, "running"), helper(2, "running"), helper(3, "running")];
        expect(wordOf(stateOf(agent(), works))).toBe("Waiting");
        expect(waitingOn(agent(), works, helpers, NOW).line).toBe("on 3 helpers · 4 min");
        expect(lineOf(agent(), works, false, helpers)).toMatch(/^on 3 helpers · \d+ (min|h)$/);
    });

    test("a wait on a run names the run, and each report lowers the helper count", () => {
        expect(waitingOn(agent(), [work()], [], NOW).line).toBe("on the test suite · 4 min");
        const two = waitingFor(
            {text: "3 helpers", on: "helper:1,helper:2,helper:3", since: NOW - 60},
            {helpers: [helper(1, "reported"), helper(2, "running"), helper(3, "running")], now: NOW}
        );
        expect(two.line).toBe("on 2 helpers · 1 min");
        expect(two.items.map((item) => item.reported)).toEqual([true, false, false]);
    });

    test("an idle agent with nothing to wait on is ready, never waiting", () => {
        expect(lineOf(agent(), [], false)).toBe("ready for your next message");
        expect(lineOf(agent(), [], true)).toBe("ready for the next to-do");
    });

    test("the phone says waiting only when the agent is neither working nor paused", () => {
        const running = {awaiting: {text: "the test suite", on: "", since: NOW - 120}, helpers: []};
        expect(phoneWaiting({agent: "idle", running}, NOW).line).toBe("on the test suite · 2 min");
        expect(phoneWaiting({agent: "working", running}, NOW)).toBeNull();
        expect(phoneWaiting({agent: "idle", running: {...running, paused: true}}, NOW)).toBeNull();
    });
});

describe("the message box edge", () => {
    beforeEach(() => (document.body.innerHTML = ""));

    function shown(waiting) {
        const into = document.createElement("div");
        document.body.append(into);
        const state = reactive({waiting});
        createApp({render: () => h(WaitEdge, {waiting: state.waiting})}).mount(into);
        return {into, state};
    }

    test("a wait puts what it waits on on the border, and an ended wait lights it once", async () => {
        const waiting = waitingFor({text: "the test suite", on: "", since: NOW - 60}, {now: NOW});
        const {into, state} = shown(waiting);
        expect(into.querySelector(".legend").textContent).toContain("Waiting on the test suite");
        expect(into.querySelector(".wait-edge").classList.contains("waiting")).toBe(true);
        state.waiting = null;
        await flush();
        expect(into.querySelector(".legend").textContent).toContain("The test suite finished");
        expect(into.querySelector(".wait-edge").classList.contains("lit")).toBe(true);
    });

    test("each helper report says who is still at work, and the last one says all reported", async () => {
        const wait = (state) => waitingFor({text: "2 helpers", on: "helper:1,helper:2", since: NOW - 60}, {helpers: state, now: NOW});
        const {into, state} = shown(wait([helper(1, "running"), helper(2, "running")]));
        state.waiting = wait([helper(1, "reported"), helper(2, "running")]);
        await flush();
        expect(into.querySelector(".legend").textContent).toContain("1 helper reported, 1 still at work");
        state.waiting = null;
        await flush();
        expect(into.querySelector(".legend").textContent).toContain("All 2 helpers reported");
    });

    test("with no wait there is no label", () => {
        const {into} = shown(null);
        expect(into.querySelector(".legend")).toBeNull();
    });
});
