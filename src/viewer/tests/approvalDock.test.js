import {createApp, h, ref} from "vue";
import {expect, test} from "vitest";
import ApprovalDock from "../../core/modules/approvals/web/src/ApprovalDock.vue";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {provideDockCard} from "../kit/windowContextKey.js";
import {context, settle} from "./support/windowContext.js";

async function drawn(text) {
    const window = context({});
    window.option = (key) => ({row: ref({id: 7, target_id: 16})})[key];
    const element = document.createElement("div");
    const app = createApp({render: () => h(ApprovalDock)});
    app.provide(WINDOW_CONTEXT, window);
    provideDockCard((key, value) => app.provide(key, value), {data: ref({rows: [{id: 16, text, arguments: ["rule", "approve", "3"]}]}), reload: async () => {}, readOutput: async () => ({ok: true, value: {lines: []}})});
    app.mount(element);
    await settle();
    return element;
}

test("the question of an approval is the card's title and its details are muted text below", async () => {
    const element = await drawn("Add this project rule?\nName every file plainly, and keep each name to words anyone knows.");
    const title = element.querySelector("[data-approval-question]");
    const description = element.querySelector("[data-approval-description]");
    expect(title.textContent).toBe("Add this project rule?");
    expect(description.textContent).toBe("Name every file plainly, and keep each name to words anyone knows.");
    expect(title.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(description.textContent).not.toContain("Add this project rule?");
});

test("an approval with only a question shows a title and no description", async () => {
    const element = await drawn("Resume the paused agent 12?");
    expect(element.querySelector("[data-approval-question]").textContent).toBe("Resume the paused agent 12?");
    expect(element.querySelector("[data-approval-description]")).toBeNull();
});
