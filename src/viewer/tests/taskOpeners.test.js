import {createApp, h} from "vue";
import {expect, test} from "vitest";
import TaskDetails from "../src/tasks/TaskDetails.vue";

function details(openers) {
    const element = document.createElement("div");
    const task = {id: 1, state: "blocked", priority: 200, reason: "Waiting", openers, waits: [], logs: [], block_renewals: [], updated_at: "2026-01-01T00:00:00Z"};
    createApp({render: () => h(TaskDetails, {task})}).mount(element);
    return element;
}

test("a blocked task shows its target or command and its last attempt", () => {
    expect(details(["task 2 is settled"]).textContent).toContain("task 2 is settled");
    expect(details(["check cart passes; last tried 2026-01-02"]).textContent).toContain("last tried 2026-01-02");
});

test("a block without an opener warns that nothing opens it automatically", () => {
    expect(details([]).textContent).toContain("Nothing opens this task automatically");
});
