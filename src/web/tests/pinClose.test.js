import {createApp, h, nextTick} from "vue";
import {expect, test, vi} from "vitest";

test("a pin goes the moment it is closed, and the server is told behind it; one the server refuses comes back", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {api} = await import("../src/api/client.js");
    let answer;
    api.closeNotice = vi.fn(() => new Promise((resolve, reject) => (answer = {resolve, reject})));
    const {default: PinnedNotices} = await import("../src/chat/PinnedNotices.vue");
    const notices = [{n: 4, title: "A pin", completed: 0, deleted: 0, seen: [], data: {tone: "note"}, created: 1}];
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(PinnedNotices, {notices, withoutToggle: true})});
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    await new Promise((done) => setTimeout(done, 1600));
    expect(host.querySelectorAll(".chat-notice").length).toBe(1);
    host.querySelector(".chat-notice button").click();
    await nextTick();
    const leaving = [...host.querySelectorAll(".chat-notice")].every((el) => el.className.includes("act-leave"));
    expect([leaving, api.closeNotice.mock.calls[0][0]]).toEqual([true, 4]);
    answer.reject(new Error("refused"));
    await new Promise((done) => setTimeout(done, 50));
    await nextTick();
    expect([...host.querySelectorAll(".chat-notice")].some((el) => !el.className.includes("act-leave"))).toBe(true);
    app.unmount();
    host.remove();
});
