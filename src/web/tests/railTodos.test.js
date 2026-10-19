import {createApp, h, nextTick} from "vue";
import {describe, expect, test, vi} from "vitest";
import RailTodos from "../src/rail/RailTodos.vue";

const at = (seconds) => new Date(seconds * 1000).toISOString();
const task = (id, title, finished = 0) => ({table: "tasks", id, title, state: finished ? "done" : "open", finished_at: finished ? at(finished) : null, plan_id: null});
const rows = [task(1, "Still open"), task(2, "Finished early", 100), task(3, "Finished late", 300)];

async function shown(props, scope) {
    const host = window.document.createElement("div");
    const app = createApp({render: () => h(RailTodos, props)});
    app.provide("scope", {rows: () => rows, loaded: () => true, ...scope});
    app.mount(host);
    await nextTick();
    return host;
}

describe("the tasks list of an agent", () => {
    test("lists the tasks it finished too, the latest first", async () => {
        const host = await shown({finished: true});
        const titles = [...host.querySelectorAll(".rail-row-title")].map((one) => one.textContent);
        expect(titles).toEqual(["Still open", "Finished late", "Finished early"]);
        expect(host.textContent).toContain("Finished");
    });

    test("is only the open ones where the list is not an agent's, and asks an environment of its own for its latest", async () => {
        const plain = await shown({});
        expect([...plain.querySelectorAll(".rail-row-title")].map((one) => one.textContent)).toEqual(["Still open"]);
        const recent = vi.fn();
        await shown({finished: true}, {recent});
        expect(recent).toHaveBeenCalledWith("tasks", 20);
    });
});
