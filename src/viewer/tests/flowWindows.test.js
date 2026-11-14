import {expect, test} from "vitest";
import {settled} from "./settled.js";
import TriggerCards from "../../core/modules/triggers/web/src/TriggerCards.vue";
import CheckCards from "../../suites/coding/modules/checks/web/src/CheckCards.vue";
import {mounted} from "./mountedWindow.js";
import {mounted as mountedWindow, page} from "./support/windowContext.js";
import {triggerWindowContext} from "./support/triggerWindowContext.js";

const mountedTrigger = (rows) => mountedWindow(TriggerCards, triggerWindowContext({"trigger list": page(rows)}));

test("a trigger slip shows only its name, its line and its number", async () => {
    const element = await mountedTrigger([{id: 1, name: "Release checks", description: "Runs the checks", action: "nudge", text: "Run the release sequence", phrases: ["deploy", "release"], next_at: null}]);
    await settled();
    const slip = element.querySelector('[data-row="1"]');
    expect(slip.textContent).toContain("Release checks");
    expect(slip.textContent).toContain("Runs the checks");
    expect(slip.textContent).toContain("#1");
    expect(slip.textContent).not.toContain("deploy");
});

test("a trigger from before, with no name, shows by its text", async () => {
    const element = await mountedTrigger([{id: 2, action: "nudge", text: "Check the build", phrases: [], next_at: "2036-01-01T00:00:00Z"}]);
    await settled();
    expect(element.querySelector('[data-row="2"]').textContent).toContain("Check the build");
});

test("a trigger an agent made says it waits and offers to enable it, and an enabled one does not", async () => {
    const element = await mountedTrigger([{id: 3, action: "nudge", text: "Mind the cart", phrases: ["cart"], next_at: null, needs_enabling: true}, {id: 4, action: "nudge", text: "Mind the till", phrases: ["till"], next_at: null, needs_enabling: false}]);
    await settled();
    expect(element.querySelector('[data-row="3"]').textContent).toContain("Waiting for you");
    expect(element.querySelector('[data-row="4"]').textContent).not.toContain("Waiting for you");
    expect(element.querySelectorAll("[data-trigger-enable]")).toHaveLength(1);
});

test("a check card shows its title, verdict and how often it runs, and its command and output once opened", async () => {
    const element = mounted(CheckCards, [{id: 1, title: "Lint", status: "failed", interval_minutes: 15, command: "echo two problems; false", last_output: "two problems"}]);
    await settled();
    const card = element.querySelector('[data-row="1"]');
    expect(card.textContent).toContain("Check 1");
    expect(card.textContent).toContain("failed · Every 15 minutes");
    expect(card.textContent).toContain("echo two problems; false");
    expect(card.querySelector("pre")).toBeNull();
    card.click();
    await settled();
    expect(document.body.querySelector("[data-check-output]").textContent).toBe("two problems");
});

test("a running check shows a bar at its percent, and none once it ended", async () => {
    const element = mounted(CheckCards, [{id: 1, title: "Lint", status: "running", interval_minutes: 0, command: "x", run_percent: 40}, {id: 2, title: "Types", status: "passed", interval_minutes: 0, command: "y", run_percent: null}]);
    await settled();
    expect(element.querySelector('[data-row="1"] [data-check-progress] span').style.width).toBe("40%");
    expect(element.querySelector('[data-row="2"] [data-check-progress]')).toBeNull();
});

test("a window with no rows says so", async () => {
    const element = mounted(CheckCards, []);
    await settled();
    expect(element.textContent).toContain("No checks yet");
});
