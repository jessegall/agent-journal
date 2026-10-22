import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {settle} from "./settle.js";

const info = {kind: "Worker", name: "Lady Montagu", state: {key: "working", word: "Working", dot: "running"}, facts: ["opus", "worker 7"], actions: []};

async function heading(withInfo) {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: Head} = await import("../src/agents/AgentInspectorHead.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(Head, {info: withInfo})});
    app.directive("tip", {});
    app.mount(host);
    await settle();
    const shown = {title: host.querySelector(".inspector-title"), line: host.querySelector(".inspector-line").textContent};
    app.unmount();
    host.remove();
    return shown;
}

test("a worker's heading is its name with its kind and state, and holds no brief", async () => {
    const shown = await heading(info);
    expect(shown.title).toBe(null);
    expect(shown.line).toContain("Worker");
    expect(shown.line).toContain("Lady Montagu");
    expect(shown.line).toContain("Working");
});

test("an agent with a task still shows it under the name", async () => {
    expect((await heading({...info, title: "Fix the footer"})).title.textContent).toBe("Fix the footer");
});
