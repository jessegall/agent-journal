import {createApp, h, nextTick} from "vue";
import {describe, expect, test} from "vitest";
import agentPage from "../src/resource/AgentPage.vue?raw";

const row = (table) => ({table, id: 1, ref: `${table}:1`, brief: "Words", sections: [], data: {}, refs: []});

async function shown(props) {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: DocumentPage} = await import("../src/resource/DocumentPage.vue");
    const host = window.document.createElement("div");
    window.document.body.append(host);
    createApp({render: () => h(DocumentPage, props, {default: () => h("p", {class: "inside"}, "inside")})}).mount(host);
    await nextTick();
    return host;
}

describe("comments on a page", () => {
    test("a document page keeps the comment box", async () => {
        const host = await shown({resource: row("plans")});
        expect(host.querySelector(".inside")).not.toBeNull();
        expect(host.querySelector(".comment-bar")).not.toBeNull();
    });

    test("a document's comments say its text can be selected to comment on a passage", async () => {
        const host = await shown({resource: row("docs"), focus: 9});
        expect(host.querySelector(".document-aside .none-hint").textContent).toBe("Select text in the document to comment on that passage.");
    });

    test("the worker and agent dialogs, drawn read-only in the page frame, show no comment box and no comments column", async () => {
        const host = await shown({resource: row("agents"), readOnly: true});
        expect(host.querySelector(".inside")).not.toBeNull();
        expect(host.querySelector(".comment-bar")).toBeNull();
        expect(host.querySelector(".document-aside")).toBeNull();
    });

    test("the agent page puts no comments button in the inspector", () => {
        expect(agentPage).not.toContain("CommentToggle");
    });
});
