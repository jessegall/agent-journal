import {createApp, h, nextTick} from "vue";
import {expect, test, vi} from "vitest";
import {store} from "../src/state/store.js";

globalThis.ResizeObserver ??= class {
    observe() {}

    unobserve() {}

    disconnect() {}
};

vi.mock("../src/resource/RowGroups.vue", () => ({
    default: {props: ["groups"], render() {
        return h("ul", this.groups.flatMap((g) => g.list.map((r) => h("li", {class: "listed"}, r.title))));
    }},
}));

const task = (id, title, plan_id = null) => ({table: "tasks", id, title, state: "open", plan_id, created_at: new Date(id * 1000).toISOString(), closed_at: null});

test("the open tasks listed are the ones the open count counts: a plan's tasks stay behind their plan", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    store.rows.tasks = [task(1, "Free task"), task(2, "Task in a plan", 5)];
    store.counts = {tasks: {open: 1, all: 1}};
    const {default: Index} = await import("../src/pages/Index.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(Index, {table: "tasks"})});
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    await nextTick();
    expect([...host.querySelectorAll(".listed")].map((e) => e.textContent)).toEqual(["Free task"]);
    expect(host.querySelector(".tab-n").textContent.trim()).toBe("1");
    app.unmount();
    host.remove();
});
