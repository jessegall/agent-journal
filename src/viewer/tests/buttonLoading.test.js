import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import ButtonSlot from "../src/kit/ButtonSlot.vue";
import {startButtons} from "../src/domain/buttons.js";
import {settle} from "./support/windowContext.js";

const BUTTON = {name: "plans.approve", slots: ["row.plan"], label: "Approve", runs: "plan approve {row_id}", fields: [], menu: [], condition: null};
const mounted = [];

afterEach(() => {
    mounted.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function drawn(props = {}) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(ButtonSlot, {name: "row.plan", row: {id: 12}, environment: "main", ...props})});
    app.mount(element);
    mounted.push(app);
    await nextTick();
    return element;
}

test("the initial load reserves button height without drawing transient controls", async () => {
    let finish;
    vi.stubGlobal("fetch", () => new Promise((resolve) => { finish = resolve; }));
    const catalogue = startButtons("main", {});
    const element = await drawn();
    expect(catalogue.loading.value).toBe(true);
    expect(catalogue.loaded.value).toBe(false);
    expect(element.querySelector(".button-slot.loading")).not.toBeNull();
    expect(element.querySelector("button")).toBeNull();
    finish({ok: true, json: async () => ({buttons: [BUTTON], missing: {}})});
    await catalogue.load();
    await settle();
    expect(catalogue.loaded.value).toBe(true);
    expect(element.textContent).toBe("Approve");
    const reload = catalogue.load();
    await nextTick();
    expect(element.textContent).toBe("Approve");
    finish({ok: true, json: async () => ({buttons: [BUTTON], missing: {}})});
    await reload;
});

test("a failed load explains the missing buttons and retry draws them", async () => {
    let finish;
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("offline")).mockImplementation(() => new Promise((resolve) => { finish = resolve; })));
    const catalogue = startButtons("main", {});
    await catalogue.load().catch(() => {});
    const element = await drawn();
    expect(catalogue.failed.value).toBe("offline");
    expect(element.querySelector('[role="alert"]').textContent).toContain("Buttons could not be loaded.");
    const retry = element.querySelector("button");
    expect(retry.textContent).toBe("Try again");
    retry.click();
    await nextTick();
    expect(element.querySelector("button")).toBeNull();
    expect(element.querySelector(".button-slot.loading")).not.toBeNull();
    finish({ok: true, json: async () => ({buttons: [BUTTON], missing: {}})});
    await catalogue.load();
    await settle();
    expect(catalogue.failed.value).toBe("");
    expect(element.textContent).toBe("Approve");
});

test("a share visitor sees neither a loading placeholder nor retry controls", async () => {
    vi.stubGlobal("fetch", async () => { throw new Error("offline"); });
    const catalogue = startButtons("main", {});
    await catalogue.load().catch(() => {});
    const element = await drawn({readOnly: true});
    expect(element.textContent).toBe("");
    expect(element.querySelector(".loading")).toBeNull();
});
