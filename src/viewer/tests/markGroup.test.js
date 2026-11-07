import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import MarkGroup from "../src/chat/MarkGroup.vue";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
});

const GROUP = {
    id: "mark-group:1",
    time: 5,
    label: "2 rules and reminders recalled",
    declaration: {family_icon: "reminder", mark_icon: "rule", group: "reminders"},
    marks: [{id: 1, type: "reminder", text: "First rule", state: "shown", created_at: 5}, {id: 2, type: "reminder", text: "Second rule", state: "shown", created_at: 6}],
};
let app = null;
let root = null;

afterEach(() => {
    app?.unmount();
    root?.remove();
});

function drawn() {
    root = document.createElement("div");
    document.body.append(root);
    app = createApp({render: () => h(MarkGroup, {group: GROUP})});
    app.mount(root);
}

test("an opened group shows its marks under its line, not inside it", async () => {
    drawn();
    root.querySelector(".mark").click();
    await nextTick();
    expect(root.querySelector(".mark [data-mark-group-rows]")).toBeNull();
    expect(root.querySelector(".thread-turn.group > [data-mark-group-rows]")).not.toBeNull();
});

test("a group draws one line with its label and none of its marks until it is opened", () => {
    drawn();
    expect(root.textContent).toContain("2 rules and reminders recalled");
    expect(root.textContent).not.toContain("First rule");
});

test("a click on the line opens it to each mark, and the next folds it back", async () => {
    drawn();
    root.querySelector(".mark").click();
    await nextTick();
    expect(root.querySelector("[data-mark-group-rows]").textContent).toContain("First rule");
    expect(root.querySelector("[data-mark-group-rows]").textContent).toContain("Second rule");
    for (let turn = 0; turn < 3; turn += 1) await nextTick();
    expect(root.querySelector("[data-mark-group-rows]").classList.contains("open")).toBe(true);
    root.querySelector(".mark").click();
    for (let turn = 0; turn < 3; turn += 1) await nextTick();
    expect(root.querySelector("[data-mark-group-rows]").classList.contains("open")).toBe(false);
});
