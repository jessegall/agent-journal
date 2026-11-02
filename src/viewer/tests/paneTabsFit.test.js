import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {settled} from "./settled.js";
import PaneTabs from "../src/panes/PaneTabs.vue";

const TABS = [{key: "a.tasks", title: "Tasks", icon: "window", on: true}, {key: "a.plans", title: "Plans", icon: "window"}, {key: "a.chat", title: "Chat", icon: "window"}];
const LABELS_WIDTH = 420;
const ICONS_WIDTH = 150;

let barWidth = 0;
let resized = [];
let drawn = [];

// jsdom measures nothing: the row is as wide as the bar, and its tabs as wide as they would be with their labels, or without those of the tabs not shown
vi.stubGlobal("ResizeObserver", class {
    constructor(callback) {
        resized.push(callback);
    }

    observe() {}

    disconnect() {}
});
Object.defineProperty(HTMLElement.prototype, "clientWidth", {configurable: true, get() { return this.classList.contains("pane-tabs-row") ? barWidth : 0; }});
Object.defineProperty(HTMLElement.prototype, "scrollWidth", {configurable: true, get() { return this.classList.contains("pane-tabs-row") ? (this.parentElement.classList.contains("compact") ? ICONS_WIDTH : LABELS_WIDTH) : 0; }});

async function shown(width) {
    barWidth = width;
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(() => h(PaneTabs, {tabs: TABS}));
    app.mount(element);
    drawn.push({app, element});
    await settled();
    return element;
}

afterEach(() => {
    drawn.forEach(({app, element}) => (app.unmount(), element.remove()));
    drawn = [];
    resized = [];
});

test("a bar wide enough for every label shows them", async () => {
    const element = await shown(700);
    expect(element.querySelector(".pane-tabs").classList.contains("compact")).toBe(false);
});

test("a bar too narrow for the labels shows the inactive tabs as icons", async () => {
    const element = await shown(300);
    expect(element.querySelector(".pane-tabs").classList.contains("compact")).toBe(true);
});

test("the bar goes from icons back to labels when it grows wide enough, measured from its own width", async () => {
    const element = await shown(300);
    barWidth = 700;
    resized.forEach((callback) => callback());
    await settled();
    expect(element.querySelector(".pane-tabs").classList.contains("compact")).toBe(false);
    barWidth = LABELS_WIDTH - 1;
    resized.forEach((callback) => callback());
    await settled();
    expect(element.querySelector(".pane-tabs").classList.contains("compact")).toBe(true);
});
