import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {settled} from "./settled.js";
import SharePage from "../src/pages/SharePage.vue";

const PHONE_WIDTH = 400;
const WIDE_WIDTH = 1400;
const SHARE = {window: "plans.plans", kind: "plan", title: "Version 5 core", facts: ["3 phases", "2 tasks"], ends: "2026-11-07"};

let mounted = [];

async function page({width = PHONE_WIDTH, props = {share: SHARE}} = {}) {
    vi.stubGlobal("innerWidth", width);
    vi.stubGlobal("fetch", async () => ({ok: true, json: async () => ({code: 0, value: {rows: [], total: 0}, error: ""})}));
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(SharePage, props)).mount(element);
    mounted.push(element);
    await settled();
    return element;
}

afterEach(() => {
    mounted.forEach((element) => element.remove());
    mounted = [];
    vi.unstubAllGlobals();
});

test("a shared plan shows one narrow window with a strip naming what is shared, its facts, that it is view only and when the link ends", async () => {
    const element = await page();
    const strip = element.querySelector(".share-strip");
    expect(strip.textContent).toContain("Shared plan");
    expect(strip.textContent).toContain("3 phases");
    expect(strip.textContent).toContain("2 tasks");
    expect(strip.textContent).toContain("View only");
    expect(strip.textContent).toContain("Link ends 2026-11-07");
    expect(element.querySelectorAll(".window")).toHaveLength(1);
});

test("the footer says it was shared from an agent journal", async () => {
    const element = await page();
    expect(element.querySelector(".share-footer").textContent).toContain("Shared from an agent journal");
});

test("the page offers nothing to change: no buttons that run a line, no composer, no rail", async () => {
    const element = await page();
    expect(element.querySelector("[data-run]")).toBeNull();
    expect(element.querySelector("textarea")).toBeNull();
    expect(element.querySelector(".rail")).toBeNull();
});

test("at phone width the plan's timeline sits below the plan", async () => {
    const element = await page({width: PHONE_WIDTH});
    expect(element.querySelector("[data-share-body]").dataset.arrangement).toBe("stacked");
    const plan = element.querySelector("[data-share-part='plan']");
    const timeline = element.querySelector("[data-share-part='timeline']");
    expect(plan.compareDocumentPosition(timeline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test("on a wide screen the timeline sits beside the plan", async () => {
    const element = await page({width: WIDE_WIDTH});
    expect(element.querySelector("[data-share-body]").dataset.arrangement).toBe("beside");
});

test("a link that opens nothing shows only that it opens nothing", async () => {
    const element = await page({props: {share: null}});
    expect(element.textContent).toContain("This link doesn't open anything");
    expect(element.querySelector(".share-strip")).toBeNull();
    expect(element.querySelector(".window")).toBeNull();
});

test("a share page shows no visitor comments", async () => {
    const element = await page();
    expect(element.querySelector("[data-comments], .comments")).toBeNull();
});
