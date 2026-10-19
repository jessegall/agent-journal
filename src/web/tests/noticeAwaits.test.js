import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";

const notice = (fields) => ({table: "notices", id: 4, title: "A notice", link: "", label: "", tone: "note", closed_at: null, created_at: new Date(1000).toISOString(), ...fields});

test("a notice only tells the user something, so the tour never waits behind one", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: PinnedNotices} = await import("../src/chat/PinnedNotices.vue");
    const {COVERING} = await import("../src/composables/tour.js");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(PinnedNotices, {notices: [notice({}), notice({id: 5, link: "tasks:1", label: "open"})], withoutToggle: true})});
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    expect([host.querySelectorAll(".chat-notice").length, Boolean(document.querySelector(COVERING))]).toEqual([2, false]);
    app.unmount();
    host.remove();
});
