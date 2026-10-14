import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";

const notice = (data) => ({n: 4, title: "A notice", completed: 0, deleted: 0, seen: [], data: {tone: "note", ...data}, created: 1});

const covers = async (PinnedNotices, COVERING, data) => {
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(PinnedNotices, {notices: [notice(data)], withoutToggle: true})});
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    const covered = Boolean(document.querySelector(COVERING));
    app.unmount();
    host.remove();
    return covered;
};

test("the tour waits behind a notice that asks the user for an answer, and not behind one that only tells them something", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: PinnedNotices} = await import("../src/chat/PinnedNotices.vue");
    const {COVERING} = await import("../src/composables/tour.js");
    expect({
        passkey: await covers(PinnedNotices, COVERING, {action: "passkey", phone: "p1"}),
        permission: await covers(PinnedNotices, COVERING, {action: "permission", session: "claude-1"}),
        plain: await covers(PinnedNotices, COVERING, {}),
        nudge: await covers(PinnedNotices, COVERING, {session: "claude-1"}),
    }).toEqual({passkey: true, permission: true, plain: false, nudge: false});
});
