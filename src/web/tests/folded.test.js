import {expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {settle} from "./settle.js";

// a fold measures its body against the page: here every body is tall
Object.defineProperty(HTMLElement.prototype, "scrollHeight", {configurable: true, get: () => 2000});
// the observer the fold measures with: here it measures once, as soon as it watches
globalThis.ResizeObserver = class {
    constructor(onResize) {
        this.onResize = onResize;
    }
    observe() {
        this.onResize();
    }
    disconnect() {}
};

async function mounted(name) {
    const {default: Folded} = await import("../src/kit/Folded.vue");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const app = createApp({render: () => h(Folded, {name, at: 100, keep: 100}, () => h("p", "a long document"))});
    app.mount(host);
    await settle();
    await new Promise((r) => requestAnimationFrame(r));
    await settle();
    return {host, unmount: () => (app.unmount(), host.remove())};
}

test("a named fold opened by the user stays open when the row is drawn anew", async () => {
    const first = await mounted("docs:55");
    expect(first.host.querySelector(".fold").textContent).toBe("Show more");
    first.host.querySelector(".fold").click();
    await settle();
    expect(first.host.querySelector(".fold").textContent).toBe("Show less");
    first.unmount();
    const again = await mounted("docs:55");
    expect(again.host.querySelector(".fold").textContent).toBe("Show less");
    again.unmount();
    const other = await mounted("docs:56");
    expect(other.host.querySelector(".fold").textContent).toBe("Show more");
    other.unmount();
});
