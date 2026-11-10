import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import LockdownBand from "../src/shell/LockdownBand.vue";

const mounted = [];
const REASON = "Claude is at your usage limit until 14:00 on 10 Nov";

afterEach(() => {
    mounted.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
});

function shown(lockdowns, opened = []) {
    const app = createApp({render: () => h(LockdownBand, {lockdowns, onOpen: (anchor) => opened.push(anchor)})});
    app.mount(document.body.appendChild(document.createElement("div")));
    mounted.push(app);
    return document.body;
}

test("no program stopped shows no band", () => {
    expect(shown([]).querySelector("[data-lockdown-band]")).toBeNull();
});

test("a person's limit shows until when, how many agents are stopped and the way to the limits", async () => {
    const opened = [];
    const body = shown([{program: "claude", reason: REASON, ends_at: "2026-11-10T14:00:00+00:00", limit_id: 3, halted_count: 4}], opened);
    expect(body.querySelector("[data-lockdown-band]").textContent).toContain(`${REASON}. 4 agents are stopped.`);
    body.querySelector("[data-lockdown-limits]").click();
    await nextTick();
    expect(opened).toHaveLength(1);
});

test("the plan's own window shows no limit to change and one agent reads in the singular", () => {
    const body = shown([{program: "claude", reason: REASON, ends_at: "2026-11-10T14:00:00+00:00", limit_id: null, halted_count: 1}]);
    expect(body.querySelector("[data-lockdown-limits]")).toBeNull();
    const text = body.querySelector("[data-lockdown-band]").textContent;
    expect(text).toContain("1 agent is stopped.");
    expect(text).toContain("The plan's own allowance is used up.");
});
