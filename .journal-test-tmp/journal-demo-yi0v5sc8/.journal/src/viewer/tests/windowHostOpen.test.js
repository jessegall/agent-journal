import {createApp, h} from "vue";
import {expect, test} from "vitest";
import WindowHost from "../src/windows/WindowHost.vue";
import {OPEN_VIEW, useWindow} from "../src/windows/windowContext.js";

test("a window opening another reaches the stage that holds the panes", () => {
    const opened = [];
    let context = null;
    const body = {setup() { context = useWindow(); return () => h("p"); }};
    const app = createApp({render: () => h(WindowHost, {name: "a.window", component: body, subscriptions: {add: () => {}, remove: () => {}, shown: () => {}}})});
    app.provide(OPEN_VIEW, (name) => opened.push(name));
    app.mount(document.createElement("div"));
    context.open("questions.questions");
    expect(opened).toEqual(["questions.questions"]);
});
