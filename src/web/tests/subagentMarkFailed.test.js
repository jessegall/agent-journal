import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import SubagentMark from "../src/chat/SubagentMark.vue";

async function drawn(props) {
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(SubagentMark, props)});
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    const shown = {text: host.textContent, red: host.innerHTML.includes("--tone-danger")};
    app.unmount();
    host.remove();
    return shown;
}

test("a dispatch the tool could not run is a red mark saying it failed and why", async () => {
    const failed = await drawn({task: "look", kind: "journal-researcher", model: "haiku", finished: true, failed: true, reason: "Model 'haiku-9' not found", time: 10});
    expect(failed.text).toContain("Dispatch failed");
    expect(failed.text).toContain("look: Model 'haiku-9' not found");
    expect(failed.red).toBe(true);
    const done = await drawn({task: "look", kind: "journal-researcher", model: "haiku", finished: true, time: 10});
    expect(done.text).toContain("Subagent finished");
    expect(done.red).toBe(false);
});
