import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

const read = (path) => readFileSync(resolve(__dirname, path), "utf8");

test("a task opened in the side panel is 640px wide by default, and 760px once its comments are open", () => {
    const panel = read("../src/resource/ResourcePanel.vue");
    expect(panel).toContain("task: noun === 'task'");
    expect(panel).toMatch(/\.panel\.task \{\s*width: min\(640px, 100vw\);/);
    expect(panel.indexOf(".panel.task {")).toBeLessThan(panel.indexOf(".panel.wide {"));
});

test("the task inspector beside the task list is 560px wide", () => {
    expect(read("../src/tasks/TaskInspector.vue")).toMatch(/\.task-inspector \{[^}]*width: 560px;/);
});
