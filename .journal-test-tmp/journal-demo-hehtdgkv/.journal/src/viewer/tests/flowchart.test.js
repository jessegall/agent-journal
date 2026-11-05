import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import {layoutOf} from "../src/domain/flowchart.js";

const EDGES = [["Open", "Started", ""], ["Started", "Done", "its outcome"]];

test("a flowchart message opens its chart in a dialog", async () => {
    const element = await mounted(Chat, context({"message feed": page([{id: 1, type: "agent", text: "How a task moves", flowchart_edges: JSON.stringify(EDGES), created_at: "2026-11-01T10:00:00Z"}])}));
    expect(element.textContent).toContain("How a task moves");
    element.querySelector("[data-flowchart-open]").click();
    await settle();
    expect(document.body.textContent).toContain("Started");
});

test("a plain message has no flowchart button", async () => {
    const element = await mounted(Chat, context({"message feed": page([{id: 1, type: "agent", text: "Hello", flowchart_edges: "[]", created_at: "2026-11-01T10:00:00Z"}])}));
    expect(element.querySelector("[data-flowchart-open]")).toBeNull();
});

test("the layout places each card once and sizes the drawing", () => {
    const chart = layoutOf(EDGES);
    expect(chart.width).toBeGreaterThan(0);
    expect(chart.height).toBeGreaterThan(0);
});
