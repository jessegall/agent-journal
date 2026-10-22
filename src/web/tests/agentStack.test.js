import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import AgentStack from "../src/chat/AgentStack.vue";

const agent = {
    stack: [
        {name: "wait", title: "Waiting", values: {}, awaits: "a worker to report"},
        {name: "working", title: "Working", values: {task_id: 12}, awaits: ""},
        {name: "idle", title: "Idle", values: {}, awaits: ""},
    ],
    trail: [
        {time: 1, before: ["idle"], after: ["idle", "working"], cause: "TaskStarted", refused: "", line: ""},
        {time: 2, before: ["idle", "working"], after: ["idle", "working"], cause: "WorkerDispatched", refused: "wait", line: "a worker is still out"},
    ],
};

test("the stack shows its states top first with values and what a wait awaits, and the trail shows the latest changes newest first", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(AgentStack, {agent})});
    app.mount(host);
    await nextTick();
    expect([...host.querySelectorAll(".stack-title")].map((e) => e.textContent)).toEqual(["Waiting", "Working", "Idle"]);
    expect(host.querySelector(".stack-values").textContent).toBe("task id 12");
    expect(host.querySelector(".stack-awaits").textContent).toBe("Waiting for a worker to report");
    expect([...host.querySelectorAll(".trail-line")].map((e) => e.textContent)).toEqual(["push of wait refused: a worker is still out", "idle > idle, working, by TaskStarted"]);
    app.unmount();
    host.remove();
});
