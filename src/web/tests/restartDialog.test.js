import {expect, test} from "vitest";
import {pinnedNotices, restartNotice} from "../src/domain/notices.js";

test("the restart an update needs is its own notice, never among the pins, and gone once it is closed", () => {
    const restart = {id: 1, title: "This journal needs a restart after the latest install", tone: "restart"};
    const pin = {id: 2, title: "The 4.5.0 release", tone: "note"};
    expect(restartNotice([pin, restart])).toBe(restart);
    expect(pinnedNotices([pin, restart])).toEqual([pin]);
    expect(restartNotice([pin])).toBe(null);
});

test("the restart dialog has no button to close it", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {createApp, h, nextTick} = await import("vue");
    const {default: Dialog} = await import("../src/kit/Dialog.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(Dialog, {modal: true, closable: false, title: "This journal needs a restart after the latest install"}, () => "Quit the agent")});
    app.mount(host);
    await nextTick();
    expect(document.body.textContent).toContain("needs a restart");
    expect(document.body.querySelectorAll("button").length).toBe(0);
    app.unmount();
});
