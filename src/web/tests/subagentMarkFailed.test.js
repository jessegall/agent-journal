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
    const failed = await drawn({
        task: "look",
        kind: "journal-researcher",
        model: "haiku",
        finished: true,
        failed: true,
        reason: "Model 'haiku-9' not found",
        time: 10,
    });
    expect(failed.text).toContain("Dispatch failed");
    expect(failed.text).toContain("look: Model 'haiku-9' not found");
    expect(failed.red).toBe(true);
    const done = await drawn({task: "look", kind: "journal-researcher", model: "haiku", finished: true, time: 10});
    expect(done.text).toContain("Subagent finished");
    expect(done.red).toBe(false);
});

test("a subagent's mark is light blue while it works, green once it finished, orange when stopped, and never yellow", async () => {
    const style = async (props) => {
        const host = document.createElement("div");
        document.body.append(host);
        const app = createApp({render: () => h(SubagentMark, props)});
        app.directive("tip", {});
        app.mount(host);
        await nextTick();
        const html = host.innerHTML;
        app.unmount();
        host.remove();
        return html;
    };
    expect(await style({task: "look", time: 10})).toContain("--tone-work");
    expect(await style({task: "look", finished: true, time: 10})).toContain("--tone-good");
    expect(await style({task: "look", finished: true, stopped: true, time: 10})).toContain("--tone-warn");
    expect(await style({task: "look", time: 10})).not.toContain("e2c55c");
});

test("a subagent that said it could not do the job is an orange mark with its own words", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({
        render: () => h(SubagentMark, {task: "look", finished: true, unfinished: true, reason: "I can't reach the server", time: 10}),
    });
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    expect(host.textContent).toContain("Subagent could not do it");
    expect(host.textContent).toContain("look: I can't reach the server");
    expect(host.innerHTML).toContain("--tone-warn");
    app.unmount();
    host.remove();
});
