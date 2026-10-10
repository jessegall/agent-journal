import {createApp, nextTick} from "vue";
import {expect, test} from "vitest";

test("the status line above the chat shows a chevron beside what it opens, and none when there is nothing to open", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: StatusBar} = await import("../src/layout/StatusBar.vue");
    const {store} = await import("../src/state/store.js");
    store.rows = {...store.rows, work: [{n: 3, title: "Fix the cover", completed: 0, deleted: 0, data: {}}]};
    store.agents = [{n: 1, title: "main", data: {status: "working"}}];
    store.summary = {project: "journal"};
    const host = window.document.createElement("div");
    window.document.body.append(host);
    const app = createApp(StatusBar);
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    expect(host.querySelector(".statusbar-roll.link .statusbar-chevron")).not.toBe(null);
    store.rows = {...store.rows, work: []};
    await nextTick();
    expect(host.querySelector(".statusbar-chevron")).toBe(null);
    app.unmount();
    host.remove();
});
