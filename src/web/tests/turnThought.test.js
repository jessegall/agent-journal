import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import {flush} from "./flush.js";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

const {default: TurnThought} = await import("../src/chat/TurnThought.vue");

let app = null;

afterEach(() => {
    app?.unmount();
    document.body.innerHTML = "";
});

test("a summary of the agent's words is drawn as its words, marked Summarised, never as a thought", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(TurnThought, {turn: {key: "messages:3", text: "Got it, the supervisor only starts the processes."}})});
    app.mount(host);
    await flush();
    expect(host.textContent).toContain("Summarised");
    expect(host.textContent).not.toContain("thought");
    expect(host.textContent).toContain("Got it, the supervisor only starts the processes.");
});
