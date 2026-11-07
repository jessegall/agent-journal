import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import ChatMark from "../src/kit/ChatMark.vue";
import {markLook} from "../src/domain/markLook.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));

const TYPE = {type: "updates.server-update", family_icon: "update", mark_icon: "update", group: "journal", colouring: "outcome", click: "unfold", process: true};
const STEPS = [
    {variant: "proof", figure: "step 1 of 4", fraction: 0.25, state: "shown", outcome: "running"},
    {variant: "handover", figure: "step 2 of 4", fraction: 0.5, state: "shown", outcome: "running"},
    {variant: "serving", figure: "step 3 of 4", fraction: 0.75, state: "shown", outcome: "running"},
    {variant: "finished", figure: "", fraction: 0, state: "ended", outcome: "passed"},
];
let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
});

function drawn(row) {
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(ChatMark, {mark: markLook({id: 7, text: "Updating the server", created_at: "2026-11-04T10:00:00Z", ...row}, TYPE)})});
    app.mount(host);
    return host;
}

for (const step of STEPS.slice(0, 3)) {
    test(`a server update at ${step.variant} draws a bar filled to ${step.fraction * 100}%`, () => {
        const bar = drawn(step).querySelector(".bar .progress");
        expect(bar.style.width).toBe(`${step.fraction * 100}%`);
    });
}

test("an ended server update draws no bar", () => {
    expect(drawn(STEPS[3]).querySelector(".bar")).toBeNull();
});
