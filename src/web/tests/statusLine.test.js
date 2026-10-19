import {createApp, nextTick} from "vue";
import {expect, test} from "vitest";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
const {default: StatusBar} = await import("../src/layout/StatusBar.vue");
const {store} = await import("../src/state/store.js");
const {choose} = await import("../src/state/environment.js");

const standing = (task) => ({environments: [{environment: {id: 1, name: "main"}, agent: null, task, questions: 0, messages: 0, tasks: 1, silent: false}]});

test("the status line above the chat shows a chevron beside what it opens, and none when there is nothing to open", async () => {
    choose("main");
    store.agents = [{table: "agents", id: 1, session: "s1", status: "working", state: "working", heard_at: new Date().toISOString()}];
    store.summary = standing({id: 3, title: "Fix the cover", awaiting: ""});
    const host = window.document.createElement("div");
    window.document.body.append(host);
    const app = createApp(StatusBar);
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    expect(host.querySelector(".statusbar-roll.link .statusbar-chevron")).not.toBe(null);
    store.summary = standing(null);
    await nextTick();
    expect(host.querySelector(".statusbar-chevron")).toBe(null);
    app.unmount();
    host.remove();
});
