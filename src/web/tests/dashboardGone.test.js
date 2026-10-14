import {createApp, nextTick} from "vue";
import {describe, expect, test} from "vitest";
import Dashboard from "../src/kit/Dashboard.vue";

const document = {start: "home", pages: {home: {title: "Home", view: {type: "heading", text: "Start here"}}}};

async function shown(page) {
    const host = window.document.createElement("div");
    createApp(Dashboard, {document, page}).mount(host);
    await nextTick();
    return host.textContent;
}

describe("a dashboard asked for a page that is gone", () => {
    test("shows the start page with a plain note", async () => {
        const text = await shown("sins/old");
        expect(text).toContain("no longer in this dashboard");
        expect(text).toContain("Start here");
    });

    test("a page that exists carries no note", async () => {
        expect(await shown("home")).not.toContain("no longer");
    });
});
