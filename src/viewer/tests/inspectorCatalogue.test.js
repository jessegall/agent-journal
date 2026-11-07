import {expect, test} from "vitest";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {INSPECTOR_WIDTHS, inspectorWidth} from "../src/domain/inspectorWidths.js";
import {fill, inspectorLabel} from "../src/domain/inspectorText.js";

const TASK = {noun: "task", module: "journal.core.tasks", fingerprint: "abc", reads: "task inspect {row_id}", label: "Task {id} · {state}", title: "{title}", description: "", width: "medium", components: [], comments: true, events: ["task.*"], links: null, shareable: false};
const WINDOWS = [
    {name: "tasks.board", place: "pane", shows: "environment", skeleton: [], icon: "task"},
    {name: "tasks.chain", place: "section", slots: ["inspector.task"], skeleton: [], icon: "task"},
];

async function loaded(offers) {
    const catalogue = new WindowCatalogue(async () => offers);
    await catalogue.load();
    return catalogue;
}

test("the catalogue returns the inspector of a noun and null for an unknown one", async () => {
    const catalogue = await loaded({windows: WINDOWS, inspectors: [TASK], person_id: 1});
    expect(catalogue.inspector("task")).toEqual(TASK);
    expect(catalogue.inspector("nothing")).toBeNull();
});

test("an unknown width draws small", () => {
    expect(inspectorWidth("gigantic")).toBe("min(480px, 100vw)");
    expect(inspectorWidth(undefined)).toBe("min(480px, 100vw)");
});

test("the four widths are 480, 640, 960 and 1130", () => {
    expect(INSPECTOR_WIDTHS).toEqual({small: 480, medium: 640, large: 960, wide: 1130});
    expect(["small", "medium", "large", "wide"].map(inspectorWidth)).toEqual(["min(480px, 100vw)", "min(640px, 100vw)", "min(960px, 100vw)", "min(1130px, 100vw)"]);
});

test("a template fills row fields and blanks a missing one", () => {
    const row = {id: 7, title: "Fix it", state: "started", owner: null};
    expect(fill("{title} · {state}", row)).toBe("Fix it · started");
    expect(fill("[{owner}] [{absent}]", row)).toBe("[] []");
    expect(fill("Task {row_id}", row, {row_id: 7})).toBe("Task 7");
    expect(fill("{ not a field } {}", row)).toBe("{ not a field } {}");
});

test("an empty label becomes the noun, the number and the state", () => {
    expect(inspectorLabel({...TASK, label: ""}, "task", {state: "started"}, 7)).toBe("Task 7 · Started");
    expect(inspectorLabel(TASK, "task", {state: "started"}, 7)).toBe("Task 7 · started");
});

test("loading still fills the window lists", async () => {
    const catalogue = await loaded({windows: WINDOWS, person_id: 1});
    expect(catalogue.windows.value.map((window) => window.name)).toEqual(["tasks.board"]);
    expect(catalogue.sectionsAt("inspector.task").map((window) => window.name)).toEqual(["tasks.chain"]);
    expect(catalogue.inspector("task")).toBeNull();
});
