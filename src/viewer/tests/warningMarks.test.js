import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import MarkHost from "../src/chat/MarkHost.vue";
import {peekRef} from "../src/route.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));
vi.mock("../src/domain/markRegistry.js", async (importOriginal) => ({
    ...(await importOriginal()),
    markDeclaration: () => ({group: "agent", family_icon: "agents", mark_icon: "warning", click: "open row", colouring: "group"}),
}));

afterEach(() => (document.body.innerHTML = ""));

const LONG = "Florence Nightingale is stuck: I deleted src/core/modules/approvals/web by mistake (the approvals window is gone and its built files with it, so nothing can show approvals until it is restored)";
const WARNING = {id: 1, type: "workers.stuck", variant: "warn", text: LONG, state: "shown", created_at: "2026-11-02T10:00:00Z", target_model: "agents", target_id: 12};

async function drawn() {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(MarkHost, {mark: WARNING})}).mount(element);
    await nextTick();
    return element;
}

test("a click on a warning unfolds its whole text and opens no inspector", async () => {
    const element = await drawn();
    const mark = element.querySelector(".mark");
    expect(mark.hasAttribute("data-open")).toBe(false);
    mark.querySelector(".top").click();
    await nextTick();
    expect(mark.hasAttribute("data-open")).toBe(true);
    expect(mark.querySelector(".head").textContent).toContain("restored)");
    expect(peekRef).not.toHaveBeenCalled();
});

test("the small action link on a warning opens the agent, and a second click on the line folds it", async () => {
    const element = await drawn();
    const mark = element.querySelector(".mark");
    mark.querySelector(".top").click();
    await nextTick();
    element.querySelector(".mact").click();
    expect(peekRef).toHaveBeenCalledWith("agents:12");
    mark.querySelector(".top").click();
    await nextTick();
    expect(mark.hasAttribute("data-open")).toBe(false);
});
