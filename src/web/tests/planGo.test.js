import {createApp, h, ref} from "vue";
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";

const perform = vi.fn();
vi.mock("../src/phone/outbox.js", () => ({perform: (...a) => perform(...a), ended: (e) => [401, 410].includes(e.status)}));
vi.mock("../src/phone/announce.js", () => ({announce: vi.fn(), tryAgain: (e) => `That didn't go through: ${e.message}. Try again.`}));
vi.mock("../src/phone/haptic.js", () => ({tick: vi.fn()}));

const {usePlanGo, here, phaseProgress, share} = await import("../src/phone/planGo.js");

const phase = (done, total) => ({todos: Array.from({length: total}, (_, i) => ({done: i < done}))});
const settle = async () => {
    for (let i = 0; i < 6; i++) await Promise.resolve();
};

function mounted(plan, refresh = vi.fn(), failed = vi.fn()) {
    let go;
    const into = document.createElement("div");
    const app = createApp({setup: () => ((go = usePlanGo(plan, refresh, failed)), () => h("div"))});
    app.mount(into);
    return {go, refresh, failed, app};
}

beforeEach(() => {
    vi.useFakeTimers();
    perform.mockReset();
});
afterEach(() => vi.useRealTimers());

describe("what a plan says about itself", () => {
    test("the phase shown is always one the plan has", () => {
        const plan = {phases: [{}, {}, {}]};
        expect([0, 1, 3, 9].map((current) => here({...plan, current}))).toEqual([1, 1, 3, 3]);
    });

    test("progress is counted in words and as a share", () => {
        expect([phaseProgress(phase(1, 4)), phaseProgress(phase(0, 0))]).toEqual(["1 of 4 done", "No to-dos yet"]);
        expect([share(phase(1, 4)), share(phase(0, 0))]).toEqual([25, 0]);
    });
});

describe("continuing a plan from the phone", () => {
    const plan = () => ref({n: 3, updated: 8, current: 1, status: "waiting", hold: 2});

    test("a tap holds it for the plan's seconds, then sends it once and says so", async () => {
        const {go, refresh} = mounted(plan());
        perform.mockResolvedValue("sent");
        go.start();
        go.start();
        expect(go.held).toBe(true);
        await vi.advanceTimersByTimeAsync(2100);
        await settle();
        expect(perform).toHaveBeenCalledTimes(1);
        expect(perform).toHaveBeenCalledWith({kind: "proceed", n: 3, updated: 8});
        expect([go.sent, go.waits, refresh.mock.calls.length]).toEqual([true, false, 1]);
    });

    test("undoing inside the hold sends nothing", async () => {
        const {go} = mounted(plan());
        go.start();
        go.undo();
        await vi.advanceTimersByTimeAsync(5000);
        expect(perform).not.toHaveBeenCalled();
    });

    test("when the computer cannot be reached it says it waits, instead of sent", async () => {
        const {go} = mounted(plan());
        perform.mockResolvedValue("held");
        go.start();
        go.now();
        await settle();
        expect([go.sent, go.waits]).toEqual([false, true]);
    });

    test("a plan that changed meanwhile is stale until asked again", async () => {
        const {go, refresh} = mounted(plan());
        perform.mockRejectedValue(Object.assign(new Error("changed"), {status: 409}));
        go.start();
        go.now();
        await settle();
        expect(go.stale).toBe(true);
        go.again();
        expect([go.stale, refresh.mock.calls.length]).toEqual([false, 1]);
    });

    test("an ended pairing is passed on, any other failure is said with a way to try again", async () => {
        const {go, failed} = mounted(plan());
        perform.mockRejectedValueOnce(Object.assign(new Error("gone"), {status: 401}));
        go.start();
        go.now();
        await settle();
        expect(failed).toHaveBeenCalledTimes(1);
        perform.mockRejectedValueOnce(new Error("boom"));
        go.start();
        go.now();
        await settle();
        expect(go.trouble).toBe("That didn't go through: boom. Try again.");
    });
});
