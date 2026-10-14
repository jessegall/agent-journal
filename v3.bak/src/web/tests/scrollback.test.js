import {createApp, h, nextTick, ref} from "vue";
import {beforeEach, describe, expect, test, vi} from "vitest";
import Skeleton from "../src/kit/Skeleton.vue";
import {useScrollback} from "../src/composables/scrollback.js";

beforeEach(() => {
    window.IntersectionObserver = class {
        observe() {}
        disconnect() {}
    };
    globalThis.IntersectionObserver = window.IntersectionObserver;
});

function paged(load, ready = () => true) {
    const made = {};
    const host = window.document.createElement("div");
    createApp({
        setup() {
            Object.assign(made, useScrollback(ref(null), ref(null), load, {ready}));
            return () => h("div", made.loading.value ? "loading" : "idle");
        },
    }).mount(host);
    return {made, host};
}

describe("paging back in a chat", () => {
    test("says it is loading while the older page is on its way, and asks for one page at a time", async () => {
        let arrive;
        const load = vi.fn(() => new Promise((resolve) => (arrive = resolve)));
        const {made, host} = paged(load);
        const first = made.older();
        await nextTick();
        expect(host.textContent).toBe("loading");
        await made.older();
        expect(load).toHaveBeenCalledTimes(1);
        arrive(true);
        await first;
        await nextTick();
        expect(host.textContent).toBe("idle");
    });

    test("loads nothing while the chat is not ready to page back", async () => {
        const load = vi.fn(async () => true);
        const {made} = paged(load, () => false);
        expect(await made.older()).toBe(false);
        expect(load).not.toHaveBeenCalled();
    });

    test("draws skeleton rows for the page that is arriving", () => {
        const host = window.document.createElement("div");
        createApp({render: () => h(Skeleton, {shape: "older", label: "Loading older messages"})}).mount(host);
        expect(host.querySelector("[aria-busy='true']").getAttribute("aria-label")).toBe("Loading older messages");
        expect(host.querySelectorAll(".skeleton-message").length).toBe(3);
    });
});
