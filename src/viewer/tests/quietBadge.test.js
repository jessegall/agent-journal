import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import DashboardBadge from "../src/kit/DashboardBadge.vue";
import StateBadge from "../kit/StateBadge.vue";
import {BOXED_STATES} from "../src/domain/badgeLook.js";

afterEach(() => (document.body.innerHTML = ""));

const drawn = (component, props) => {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(component, props)}).mount(element);
    return element.firstElementChild;
};

test("test_box_only_for_listed_states: a listed state is a box and every other state is faint text", () => {
    for (const state of BOXED_STATES) expect(drawn(StateBadge, {type: "plan", state, rowId: 1}).className).toContain("badge ");
    for (const state of ["open", "started", "ready", "approved", "completed", "passed"]) {
        const badge = drawn(StateBadge, {type: "plan", state, rowId: 1});
        expect(badge.classList.contains("badge-quiet")).toBe(true);
        expect(badge.classList.contains("badge")).toBe(false);
    }
});

test("the dashboard badge follows the same table: a danger or warning tone is a box, every other tone is faint text", () => {
    expect(drawn(DashboardBadge, {text: "Capped", tone: "warn"}).classList.contains("badge")).toBe(true);
    expect(drawn(DashboardBadge, {text: "Failed", tone: "danger"}).classList.contains("badge")).toBe(true);
    expect(drawn(DashboardBadge, {text: "Passed", tone: "good"}).classList.contains("badge-quiet")).toBe(true);
    expect(drawn(DashboardBadge, {text: "On"}).classList.contains("badge-quiet")).toBe(true);
});
