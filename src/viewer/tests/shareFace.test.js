import {createApp, h, shallowRef} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {settled} from "./settled.js";
import ShareFace from "../src/windows/ShareFace.vue";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";

const PHONE_WIDTH = 400;
const WIDE_WIDTH = 1400;
const SESSION = {type: "share", person_id: 2, share: {row_model: "plan", row_id: 1, environment: "main", ends_at: "2026-11-07T09:00:00.000000+00:00"}};
const PLANS_WINDOW = {render: () => h("div", {class: "plans-body"}, "Plan page")};
const ENTRY = {name: "plans.plans", entry_url: "/modules/journal.core.plans/plans.js", unavailable_reason: ""};
const PHASES = {rows: [{id: 1, position: 1, title: "Values"}, {id: 2, position: 2, title: "Models"}, {id: 3, position: 3, title: "Queries"}], total: 3};

let mounted = [];

function reads({unreachable = false, refused = false} = {}) {
    return vi.fn(async (window, line) => {
        if (unreachable) return {ok: false, failure: "unreachable", error: "offline"};
        if (refused) return {ok: false, failure: "refused", error: "not shared by the link"};
        return {ok: true, value: line[1] === "progress" ? {task_count: 2, completed_count: 0} : PHASES};
    });
}

async function face({width = PHONE_WIDTH, session = SESSION, read = reads()} = {}) {
    vi.stubGlobal("innerWidth", width);
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(ShareFace, {session, read, entry: ENTRY, subscriptions: new WindowSubscriptions(), load: async () => ({default: PLANS_WINDOW})})).mount(element);
    mounted.push(element);
    await settled();
    return {element, read};
}

afterEach(() => {
    mounted.forEach((element) => element.remove());
    mounted = [];
    vi.unstubAllGlobals();
});

test("a shared plan shows one window under a strip naming what is shared, its facts, that it is view only and when the link ends", async () => {
    const {element} = await face();
    const strip = element.querySelector(".share-strip");
    expect(strip.textContent).toContain("Shared plan");
    expect(strip.textContent).toContain("3 phases");
    expect(strip.textContent).toContain("2 tasks");
    expect(strip.textContent).toContain("View only");
    expect(strip.textContent).toContain("Link ends");
    expect(element.querySelectorAll(".window")).toHaveLength(1);
    expect(element.querySelector(".plans-body").textContent).toBe("Plan page");
});

test("it reads only the shared plan in the shared environment, through the plans window", async () => {
    const {read} = await face();
    expect(read.mock.calls).toEqual([
        ["plans.plans", ["plan", "progress", "1"], "main"],
        ["plans.plans", ["phase", "list", "--plan", "1", "--oldest"], "main"],
    ]);
});

test("the footer says it was shared from an agent journal", async () => {
    const {element} = await face();
    expect(element.querySelector(".share-footer").textContent).toContain("Shared from an agent journal");
});

test("the page offers nothing to change: no composer, no rail, no button of its own", async () => {
    const {element} = await face();
    expect(element.querySelector("textarea")).toBeNull();
    expect(element.querySelector(".rail")).toBeNull();
    expect(element.querySelector(".share-face button")).toBeNull();
});

test("at phone width the plan's timeline sits below the plan", async () => {
    const {element} = await face({width: PHONE_WIDTH});
    expect(element.querySelector("[data-share-body]").dataset.arrangement).toBe("stacked");
    const plan = element.querySelector("[data-share-part='plan']");
    const timeline = element.querySelector("[data-share-part='timeline']");
    expect(plan.compareDocumentPosition(timeline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(timeline.textContent).toContain("Values");
});

test("on a wide screen the timeline sits beside the plan", async () => {
    const {element} = await face({width: WIDE_WIDTH});
    expect(element.querySelector("[data-share-body]").dataset.arrangement).toBe("beside");
});

test("a link that opens nothing shows only that it opens nothing", async () => {
    const {element} = await face({session: null});
    expect(element.textContent).toContain("This link doesn't open anything");
    expect(element.querySelector(".share-strip")).toBeNull();
    expect(element.querySelector(".window")).toBeNull();
});

test("a refusal of the shared plan's reads shows the same screen", async () => {
    const {element} = await face({read: reads({refused: true})});
    expect(element.textContent).toContain("This link doesn't open anything");
});

test("a read that cannot reach the journal shows a reconnecting notice and keeps the page", async () => {
    const {element} = await face({read: reads({unreachable: true})});
    expect(element.textContent).toContain("Reconnecting");
    expect(element.querySelector(".share-strip")).not.toBeNull();
});

test("a share page shows no visitor comments", async () => {
    const {element} = await face();
    expect(element.querySelector("[data-comments], .comments")).toBeNull();
});
