import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h, ref} from "vue";
import {afterEach, expect, test} from "vitest";
import {INSPECTOR_ACTIONS} from "@journal/window-kit";
import DocumentBody from "../src/resource/document/DocumentBody.vue";
import {settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};

const BODY = "# One\nThe total is in cents.\n\n# Two\nThe tax is in cart.py.\n";
const ROW = {id: 4, title: "Cart", abstract: "", body: BODY, close_reason: "", created_at: "2026-11-01T10:00:00Z", updated_at: "2026-11-01T10:00:00Z", revision: 2, open_author_id: 42};
const read = async (line) => (line[1] === "inspect" ? {ok: true, value: {...ROW, comments: []}} : {ok: true, value: {rows: [], total: 0}});

async function drawn(bar) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(DocumentBody, {term: "doc", id: 4, read})});
    if (bar) app.provide(INSPECTOR_ACTIONS, ref(bar));
    app.mount(element);
    await settle();
    return element;
}

test("inside an inspector, Edit and Chapters join the action bar and leave no row of their own", async () => {
    const bar = document.createElement("div");
    document.body.append(bar);
    bar.append(Object.assign(document.createElement("button"), {textContent: "Mark the report as needing no action"}));
    const element = await drawn(bar);
    expect(bar.querySelector("[data-text-edit]")).not.toBeNull();
    expect(bar.querySelector("[data-text-chapters]")).not.toBeNull();
    expect(bar.querySelectorAll("button, [data-drop-head]").length).toBeGreaterThanOrEqual(3);
    expect(element.querySelector("[data-text-edit]")).toBeNull();
    expect(element.querySelector("[data-document-actions]")).toBeNull();
});

test("with no action bar around it, the body keeps Edit and Chapters in one row of its own", async () => {
    const element = await drawn(null);
    const row = element.querySelector("[data-document-actions]");
    expect(row.querySelector("[data-text-edit]")).not.toBeNull();
    expect(row.querySelector("[data-text-chapters]")).not.toBeNull();
});

test("the action bar puts its buttons on one line and wraps them as a row at a narrow width", () => {
    const bar = readFileSync(resolve(__dirname, "../src/kit/InspectorActions.vue"), "utf8");
    expect(bar).toMatch(/\.inspector-actions \{[^}]*display: flex;[^}]*flex-wrap: wrap;/);
});
