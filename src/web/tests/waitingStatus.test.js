import {createApp, h, nextTick, reactive} from "vue";
import {beforeEach, describe, expect, test} from "vitest";
import WaitEdge from "../src/kit/WaitEdge.vue";
import {lineOf, stateOf, waitingFor, waitingOn, wordOf} from "../src/domain/agentState.js";
import {ref} from "vue";
import {useWaiting} from "../src/composables/waiting.js";
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
        expect(waitingOn(agent(), works, helpers, NOW).line).toBe("3 helpers · 4m 00s");
        expect(lineOf(agent(), works, false, helpers)).toMatch(/^3 helpers · (\d+h )?(\d+m )?\d+s$/);
    });

    test("a wait on a run names the run, and each report lowers the helper count", () => {
        expect(waitingOn(agent(), [work()], [], NOW).line).toBe("the test suite · 4m 00s");
        const two = waitingFor(
            {text: "3 helpers", on: "helper:1,helper:2,helper:3", since: NOW - 60},
            {helpers: [helper(1, "reported"), helper(2, "running"), helper(3, "running")], now: NOW}
        );
        expect(two.line).toBe("2 helpers · 1m 00s");
        expect(two.items.map((item) => item.reported)).toEqual([true, false, false]);
        expect(two.items.map((item) => item.status)).toEqual(["Report ready", "At work", "At work"]);
        expect(waitingOn(agent(), [work()], [], NOW).items[0].status).toBe("At work");
    });

    test("an idle agent with nothing to wait on is ready, never waiting", () => {
        expect(lineOf(agent(), [], false)).toBe("ready for your next message");
        expect(lineOf(agent(), [], true)).toBe("ready for the next to-do");
    });

    test("the phone says waiting only when the agent is neither working nor paused", () => {
        const running = {awaiting: {text: "the test suite", on: "", since: NOW - 120}, helpers: []};
        expect(phoneWaiting({agent: "idle", running}, NOW).line).toBe("the test suite · 2m 00s");
        expect(phoneWaiting({agent: "working", running}, NOW)).toBeNull();
        expect(phoneWaiting({agent: "idle", running: {...running, paused: true}}, NOW)).toBeNull();
    });
});

describe("the message box edge", () => {
    beforeEach(() => (document.body.innerHTML = ""));

    function mounted(waiting) {
        const into = document.createElement("div");
        document.body.append(into);
        const state = reactive({waiting});
        createApp({render: () => h(WaitEdge, {waiting: state.waiting})}).mount(into);
        return {into, state};
    }

    test("a wait puts the word Waiting on the border, and an ended wait lights it once and says nothing", async () => {
        const waiting = waitingFor({text: "the test suite", on: "", since: NOW - 60}, {now: NOW});
        const {into, state} = mounted(waiting);
        expect(into.querySelector(".legend").textContent).toContain("Waiting");
        expect(into.querySelector(".wait-edge").classList.contains("waiting")).toBe(true);
        expect([into.querySelectorAll(".glow").length, into.querySelectorAll(".dash, svg").length]).toEqual([1, 0]);
        expect([into.querySelector(".legend")?.textContent.trim(), into.querySelectorAll(".legend .chip").length]).toEqual(["Waiting", 0]);
        state.waiting = null;
        await flush();
        expect(into.querySelector(".note")).toBeNull();
        expect(into.querySelector(".legend")).toBeNull();
        expect(into.querySelector(".wait-edge").classList.contains("lit")).toBe(true);
    });

    test("each helper report says who is still at work, and the last one says nothing", async () => {
        const wait = (state) => waitingFor({text: "2 helpers", on: "helper:1,helper:2", since: NOW - 60}, {helpers: state, now: NOW});
        const {into, state} = mounted(wait([helper(1, "running"), helper(2, "running")]));
        state.waiting = wait([helper(1, "reported"), helper(2, "running")]);
        await flush();
        expect(into.querySelector(".note").textContent).toContain("1 helper reported, 1 still at work");
        state.waiting = null;
        await flush();
        expect(into.querySelector(".note")).toBeNull();
    });

    test("with no wait there is no label", () => {
        const {into} = mounted(null);
        expect(into.querySelector(".legend")).toBeNull();
    });
});

describe("the time a wait has lasted", () => {
    test("counts seconds, and each item carries it", () => {
        const two = waitingFor({text: "2 helpers", on: "helper:1,helper:2", since: NOW - 67}, {helpers: [helper(1, "running"), helper(2, "running")], now: NOW});
        expect(two.line).toBe("2 helpers · 1m 07s");
        expect(two.items.map((item) => item.out)).toEqual(["1m 07s", "1m 07s"]);
    });

    test("a run that ended stops its timer at the end and keeps how long it took", () => {
        const runs = [{id: "run", running: false, ended: NOW - 600, task: "the suite"}];
        const wait = waitingFor({text: "the suite", on: "run", since: NOW - 1440}, {runs, now: NOW});
        expect(wait.items.map((item) => item.out)).toEqual(["14m 00s"]);
    });

    test("an idle orchestrator stays Idle and says how many helpers work", () => {
        expect(wordOf(stateOf(agent(), []))).toBe("Idle");
        expect(lineOf(agent(), [], false, [], 4)).toBe("Helpers: 4");
        expect(lineOf(agent(), [], false, [], 0)).toBe("ready for your next message");
    });
});

describe("the waiting state follows the agent it is given", () => {
    test("an inspector's own agent waits while an agent with nothing awaited does not", () => {
        const own = useWaiting(ref([]), ref(agent()), () => [work()]).waiting.value;
        expect(own.text).toBe("the test suite");
        expect(useWaiting(ref([]), ref(agent()), () => []).waiting.value).toBeNull();
    });
});
