import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import TerminalWindow from "../src/chat/TerminalWindow.vue";

globalThis.ResizeObserver ??= class {
    observe() {}

    unobserve() {}

    disconnect() {}
};

test("the terminal pane shows the commands the agent ran, asked for by the agent's number", async () => {
    const asked = [];
    const client = {
        terminal: (id, after) => {
            asked.push([id, after]);
            return Promise.resolve([{agent_id: id, time: 1, tool: "Bash", command: "pytest -q", output: "12 passed", seconds: 2, status: 0, stepped: false, level: "everything"}]);
        },
        runShell: () => Promise.resolve({}),
    };
    const agent = {id: 3, title: "main", data: {}, updated_at: ""};
    const root = document.createElement("div");
    const app = createApp({render: () => h(TerminalWindow, {agent})});
    app.provide("scope", {env: "", api: client, rows: () => [], loaded: () => true, holding: () => {}, earlier: () => {}});
    app.mount(root);
    for (let i = 0; i < 5; i++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(asked[0]).toEqual([3, 0]);
    expect(root.textContent).toContain("pytest -q");
    app.unmount();
});
