import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {settled} from "./settled.js";
import TriggerCards from "../../core/modules/triggers/web/src/TriggerCards.vue";
import CheckCards from "../../suites/coding/modules/checks/web/src/CheckCards.vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

function mounted(component, rows) {
    const context = {read: async () => ({ok: true, value: {rows}}), run: async () => ({ok: true}), follow: () => {}, face: "person"};
    const element = document.createElement("div");
    createApp({setup: () => () => h(component), provide: {[WINDOW_CONTEXT]: context}}).mount(element);
    return element;
}

test("a trigger card shows its number, action and text, and what sets it off once opened", async () => {
    const element = mounted(TriggerCards, [{id: 1, action: "nudge", text: "Run the release sequence", phrases: ["deploy", "release"], next_at: null}]);
    await settled();
    const card = element.querySelector('[data-row="1"]');
    expect(card.textContent).toContain("Trigger 1 · nudge");
    expect(card.textContent).toContain("Run the release sequence");
    expect(card.textContent).not.toContain("deploy, release");
    card.click();
    await settled();
    expect(card.textContent).toContain("deploy, release");
});

test("a scheduled trigger card says it runs on a schedule and when it is next due", async () => {
    const element = mounted(TriggerCards, [{id: 2, action: "nudge", text: "Check the build", phrases: [], next_at: "2036-01-01T00:00:00Z"}]);
    await settled();
    const card = element.querySelector('[data-row="2"]');
    expect(card.textContent).toContain("On a schedule");
    card.click();
    await settled();
    expect(card.textContent).toContain("Next at 2036-01-01T00:00:00Z");
});

test("a check card shows its title, verdict and how often it runs, and its command and output once opened", async () => {
    const element = mounted(CheckCards, [{id: 1, title: "Lint", status: "failed", interval_minutes: 15, command: "echo two problems; false", last_output: "two problems"}]);
    await settled();
    const card = element.querySelector('[data-row="1"]');
    expect(card.textContent).toContain("Check 1");
    expect(card.textContent).toContain("failed · Every 15 minutes");
    expect(card.textContent).not.toContain("two problems");
    card.click();
    await settled();
    expect(card.textContent).toContain("echo two problems; false");
    expect(card.textContent).toContain("two problems");
});

test("a window with no rows says so", async () => {
    const element = mounted(CheckCards, []);
    await settled();
    expect(element.textContent).toContain("No checks yet");
});
