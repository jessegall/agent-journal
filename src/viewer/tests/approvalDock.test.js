import {createApp, h, ref} from "vue";
import {expect, test} from "vitest";
import ApprovalDock from "../../core/modules/approvals/web/src/ApprovalDock.vue";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {provideDockCard} from "../kit/windowContextKey.js";
import {context, settle} from "./support/windowContext.js";

async function drawn(text, extra = {}) {
    const window = context({});
    window.option = (key) => ({row: ref({id: 7, target_id: 16})})[key];
    const element = document.createElement("div");
    const app = createApp({render: () => h(ApprovalDock)});
    app.provide(WINDOW_CONTEXT, window);
    provideDockCard((key, value) => app.provide(key, value), {data: ref({rows: [{id: 16, text, arguments: ["rule", "approve", "3"], ...extra}]}), reload: async () => {}, readOutput: async () => ({ok: true, value: {lines: []}})});
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

test("the reason the requester gave is shown under the question", async () => {
    const element = await drawn("Change this profile?", {justification: "The merger runs on Codex, as you asked in message 110327."});
    const justification = element.querySelector("[data-approval-why]");
    expect(justification.textContent).toBe("The merger runs on Codex, as you asked in message 110327.");
    expect(element.querySelector("[data-approval-question]").compareDocumentPosition(justification) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test("a long action line is shown whole, in a block that wraps instead of being cut", async () => {
    const line = "profile save journal-merger --description Reviews and merges the work of workers --program codex --program-if-possible --fallback-programs claude,codex --tier strongest";
    const element = await drawn("Change this profile?", {arguments: line.split(" ")});
    expect(element.querySelector("[data-approval-action]").textContent).toBe(line);
});
