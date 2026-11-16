import {createApp, h, ref} from "vue";
import {expect, test} from "vitest";
import SavedUsedDock from "../../core/modules/approvals/web/src/SavedUsedDock.vue";
import {dockLook} from "../src/domain/dockLook.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {provideDockCard} from "../kit/windowContextKey.js";
import {context, settle} from "./support/windowContext.js";

const declaration = {type: "approvals.saved-used", icon: "check", title: "Approval automatically accepted", reads: ["saved-approval show"]};
const item = {id: 7, type: "approvals.saved-used", target_model: "saved_approval", target_id: 3, title: "Approval automatically accepted", text: "Resume the paused agent 5?"};

async function drawn(saved) {
    const window = context({});
    window.option = (key) => ({row: ref(item)})[key];
    const element = document.createElement("div");
    const app = createApp({render: () => h(SavedUsedDock)});
    app.provide(WINDOW_CONTEXT, window);
    provideDockCard((key, value) => app.provide(key, value), {data: ref(saved), reload: async () => {}, readOutput: async () => ({ok: false})});
    app.mount(element);
    await settle();
    return element;
}

test("the card of an approval a saved yes accepted is titled Approval automatically accepted", () => {
    expect(dockLook(item, declaration).title).toBe("Approval automatically accepted");
});

test("under the title it names the question that was asked and why it was accepted", async () => {
    const element = await drawn({id: 3, scope: "same"});
    const question = element.querySelector("[data-saved-question]");
    const reason = element.querySelector("[data-saved-reason]");
    expect(question.textContent).toBe("Resume the paused agent 5?");
    expect(reason.textContent).toBe("You accepted this request before and chose to always accept it.");
    expect(question.compareDocumentPosition(reason) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test("a saved yes for any request like it says so in the reason", async () => {
    const element = await drawn({id: 3, scope: "like"});
    expect(element.querySelector("[data-saved-reason]").textContent).toBe("You accepted requests like this before and chose to always accept them.");
});
