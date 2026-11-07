import {createApp, defineComponent, h, ref} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import WindowHost from "../src/windows/WindowHost.vue";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {useWindow} from "../src/windows/windowContext.js";
import {perLine} from "./support/windowContext.js";

afterEach(() => vi.unstubAllGlobals());

// a fetch the test answers by hand, which fails with an abort when its request's signal fires, as a browser's does
function slowFetch() {
    const waiting = [];
    vi.stubGlobal("fetch", perLine((url, request) => new Promise((resolve, reject) => {
        request.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
        waiting.push((value) => resolve({json: async () => ({code: 0, value, error: ""})}));
    })));
    return waiting;
}

const drawn = ref("");
const reading = defineComponent({
    setup() {
        const view = useWindow();
        view.read("task list").then((answer) => (drawn.value = answer.ok ? `rows ${answer.value}` : `failed ${answer.failure}`));
        return () => h("p", "reading");
    },
});

function mounted() {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(() => h(WindowHost, {name: "tasks.tasks", component: reading, subscriptions: new WindowSubscriptions()}));
    app.mount(element);
    return app;
}

test("a window switched away while its request is slow never draws the old answer", async () => {
    drawn.value = "";
    const waiting = slowFetch();
    const app = mounted();
    await new Promise((resolve) => setTimeout(resolve));
    app.unmount();
    await new Promise((resolve) => setTimeout(resolve));
    waiting.forEach((answer) => answer("old rows"));
    await new Promise((resolve) => setTimeout(resolve));
    expect(drawn.value).toBe("failed cancelled");
});

test("a window still shown draws its answer", async () => {
    drawn.value = "";
    const waiting = slowFetch();
    mounted();
    await new Promise((resolve) => setTimeout(resolve, 5));
    waiting.forEach((answer) => answer("rows"));
    await new Promise((resolve) => setTimeout(resolve));
    expect(drawn.value).toBe("rows rows");
});

test("an answer that arrives after the window has ended is dropped even when the request was not cut off", async () => {
    drawn.value = "";
    vi.stubGlobal("fetch", perLine(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {json: async () => ({code: 0, value: "late", error: ""})};
    }));
    const app = mounted();
    await new Promise((resolve) => setTimeout(resolve));
    app.unmount();
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(drawn.value).toBe("failed cancelled");
});
