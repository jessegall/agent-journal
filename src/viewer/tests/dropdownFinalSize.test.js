import {execFileSync} from "node:child_process";
import {resolve} from "node:path";
import {createApp, h, nextTick, shallowRef} from "vue";
import {expect, test} from "vitest";
import WindowDropdown from "../src/windows/WindowDropdown.vue";
import UsagePanel from "../../core/modules/usage/web/src/UsagePanel.vue";
import ContextPanel from "../../core/modules/usage/web/src/ContextPanel.vue";
import {appended, mounted} from "./support/windowContext.js";
import {usageWindowContext} from "./support/usageWindowContext.js";
import WindowSkeleton from "../src/kit/WindowSkeleton.vue";

globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};

const ROOT = resolve(__dirname, "../../..");
const WIDTHS = {"usage.usage": "460px", "usage.context": "320px"};
const declared = JSON.parse(execFileSync(resolve(ROOT, ".venv/bin/python"), ["-c", `
import json
from core.modules.usage.support.skeletons import USAGE_USAGE_SKELETON, USAGE_CONTEXT_SKELETON
from core.modules.schedules.support.skeletons import SCHEDULES_JOBS_SKELETON
print(json.dumps({"usage.usage": [part.listed() for part in USAGE_USAGE_SKELETON], "usage.context": [part.listed() for part in USAGE_CONTEXT_SKELETON], "schedules.jobs": [part.listed() for part in SCHEDULES_JOBS_SKELETON]}))
`], {cwd: ROOT, env: {...process.env, PYTHONPATH: resolve(ROOT, "src")}, encoding: "utf8"}));
const WINDOW = {title: "7 days", used_percent: 17, reset_epoch_seconds: 1794085200};
const USAGE = {windows: [{...WINDOW, title: "5 hours", used_percent: 30}, WINDOW], agents: [{id: 1, role: "main", program: "claude", context_percent: 40}]};
const windowContext = () => usageWindowContext({"usage show": {ok: true, value: USAGE}, "usage-limit list": {ok: true, value: {rows: [], page: 1, size: 50, total: 0}}});
const PANELS = {"usage.usage": UsagePanel, "usage.context": ContextPanel};

// the rows of a skeleton are the parts its outer stack holds; the rows of a loaded window are what its room holds
const skeletonRows = (name) => appended(WindowSkeleton, {parts: declared[name]}).querySelector("[data-window-skeleton] > div").children.length;
const loadedRows = async (name) => (await mounted(PANELS[name], windowContext())).querySelector("[data-window-room]").children.length;

test.each(["usage.usage", "usage.context"])("the %s dropdown's skeleton has the rows of its loaded window", async (name) => {
    const rows = await loadedRows(name);
    expect(rows).toBeGreaterThan(1);
    expect(skeletonRows(name)).toBe(rows);
});

test.each(["usage.usage", "usage.context"])("the %s dropdown has the same fixed width while loading and once loaded", async (name) => {
    const loaded = shallowRef(false);
    const catalogue = {dropdown: () => null, window: () => null, skeleton: () => declared[name], loaded};
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(WindowDropdown, {groups: [{name, title: name, count: 1}], catalogue, subscriptions: {}, environment: "main"})).mount(element);
    await nextTick();
    const loading = element.querySelector("[data-dropdown]").style.width;
    expect(element.querySelector("[data-window-skeleton]")).not.toBeNull();
    loaded.value = true;
    await nextTick();
    expect(element.querySelector("[data-window-skeleton]")).toBeNull();
    expect(loading).toBe(WIDTHS[name]);
    expect(element.querySelector("[data-dropdown]").style.width).toBe(WIDTHS[name]);
});

test("the scheduled jobs dropdown opens at a fixed width and never shorter than its minimum height", async () => {
    const catalogue = {dropdown: () => null, window: () => null, skeleton: () => declared["schedules.jobs"], loaded: shallowRef(false)};
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(WindowDropdown, {groups: [{name: "schedules.jobs", title: "Scheduled jobs", count: 1}], catalogue, subscriptions: {}, environment: "main"})).mount(element);
    await nextTick();
    const style = element.querySelector("[data-dropdown]").style;
    expect([style.width, style.minHeight]).toEqual(["360px", "140px"]);
});
