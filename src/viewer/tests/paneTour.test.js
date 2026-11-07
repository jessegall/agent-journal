import {createApp, h, ref} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import PaneTour from "../src/panes/PaneTour.vue";
import {settle} from "./support/windowContext.js";
import {trackMutationObservers} from "./support/mutationObservers.js";

let app;
let checkObservers;
beforeEach(() => { checkObservers = trackMutationObservers(); });
afterEach(() => {
    app?.unmount();
    checkObservers();
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

async function mount(current) {
    const host = document.createElement("div");
    document.body.append(host);
    const tour = {current, hint: ref(false), step: ref(0), count: 1, next() {}, skip() {}, understood() {}};
    app = createApp(() => h(PaneTour, {tour}));
    app.mount(host);
    await settle();
}

test("a tour with no active step never watches the document", async () => {
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    await mount(ref(null));
    expect(observe).not.toHaveBeenCalled();
});

test("finishing a step removes its mark and disconnects its observer", async () => {
    const target = document.createElement("button");
    target.id = "tour-button";
    document.body.append(target);
    const current = ref({target: "#tour-button", title: "A step", text: "A description"});
    await mount(current);
    expect(target.classList.contains("tour-target")).toBe(true);
    current.value = null;
    await settle();
    expect(target.classList.contains("tour-target")).toBe(false);
    checkObservers();
});

test("an unmounted tour receives no callback from later document changes", async () => {
    await mount(ref({target: "#tour-button", title: "A step", text: "A description"}));
    app.unmount();
    app = null;
    const query = vi.spyOn(document, "querySelector");
    document.body.append(document.createElement("button"));
    await settle();
    expect(query).not.toHaveBeenCalled();
});
