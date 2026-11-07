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

const LISTING = (width) => ({noun: "thing", module: "acme.things", fingerprint: "a", reads: "thing show {row_id}", label: "", title: "{title}", description: "", width, components: [], comments: false, events: [], links: null, shareable: false});

test.each([["small", 480], ["medium", 640], ["large", 960], ["wide", 1130]])("a declared noun is drawn at its declared width: %s is %ipx and never wider than the screen", async (width, pixels) => {
    const {createApp, h} = await import("vue");
    const {default: InspectorPanel} = await import("../src/resource/InspectorPanel.vue");
    const catalogue = {inspector: () => LISTING(width), window: () => null, sectionsAt: () => []};
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(InspectorPanel, {noun: "thing", id: 1, table: "things", read: async () => ({ok: true, value: {id: 1, title: "A thing"}}), catalogue, environment: "main"})});
    app.directive("tip", {});
    app.mount(element);
    const panel = element.querySelector("[data-resource-panel]");
    expect(panel.getAttribute("style")).toContain(`min(${pixels}px, 100vw)`);
    app.unmount();
    element.remove();
});
