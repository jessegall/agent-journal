import {createApp, h, nextTick} from "vue";
import {describe, expect, test, vi} from "vitest";
import RailTodos from "../src/rail/RailTodos.vue";

const todo = (n, title, completed = 0) => ({n, title, completed, deleted: 0, ref: `todo:${n}`, refs: [], data: {}});
const rows = [todo(1, "Still open"), todo(2, "Finished early", 100), todo(3, "Finished late", 300), {...todo(4, "Gone", 400), deleted: 1}];

async function shown(props, scope) {
    const host = window.document.createElement("div");
    const app = createApp({render: () => h(RailTodos, props)});
    app.provide("scope", {rows: () => rows, loaded: () => true, ...scope});
    app.mount(host);
    await nextTick();
    return host;
}

describe("the to-dos list of an agent", () => {
    test("lists the to-dos it finished too, the latest first, and leaves out deleted ones", async () => {
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
        expect(recent).toHaveBeenCalledWith("todo", 20);
    });
});
