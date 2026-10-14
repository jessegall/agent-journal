import {createApp, h, nextTick, ref} from "vue";
import {describe, expect, test} from "vitest";
import {useWanted, wanted} from "../src/sync/wanted.js";

function mounted(when) {
    const host = window.document.createElement("div");
    const app = createApp({
        setup() {
            useWanted("ticketTodos", when);
            return () => h("div");
        },
    });
    app.mount(host);
    return app;
}

describe("a poll that only some views need", () => {
    test("is wanted while a view that reads it is on screen, and not once the view is gone", async () => {
        expect(wanted.ticketTodos || 0).toBe(0);
        const first = mounted(() => true);
        const second = mounted(() => true);
        expect(wanted.ticketTodos).toBe(2);
        first.unmount();
        expect(wanted.ticketTodos).toBe(1);
        second.unmount();
        expect(wanted.ticketTodos).toBe(0);
    });

    test("is wanted only while the view's own condition holds", async () => {
        const shown = ref(false);
        const app = mounted(() => shown.value);
        expect(wanted.ticketTodos).toBe(0);
        shown.value = true;
        await nextTick();
        expect(wanted.ticketTodos).toBe(1);
        shown.value = false;
        await nextTick();
        expect(wanted.ticketTodos).toBe(0);
        app.unmount();
    });
});
