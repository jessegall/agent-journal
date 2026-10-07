import {expect, test, vi} from "vitest";
import {ref} from "vue";

vi.mock("../src/domain/spec.js", () => ({meta: (type) => ({title: {todo: "To-do", agent: "Agent"}[type], event_labels: {}})}));

const {leadOf, runningData} = await import("../src/domain/agents.js");
const {loopRows, loopWhen} = await import("../src/domain/loops.js");
const {counted, useActivity} = await import("../src/composables/activity.js");

const agent = (n, data) => ({n, data: {status: "idle", at: n, ...data}});

test("the lead agent is the newest top-level one still running", () => {
    const lead = leadOf([agent(1), agent(3, {status: "stopped"}), agent(2), agent(4, {parent: "x"})]);
    expect(lead.n).toBe(2);
    expect(runningData(agent(5, {status: "stopped"}))).toBe(null);
    expect(leadOf([])).toBe(null);
});

test("a repeating prompt's schedule reads as plain words, oldest first", () => {
    expect(loopWhen("*/10 * * * *")).toBe("every 10 minutes");
    expect(loopWhen("5,35 * * * *")).toBe("each hour at :05, :35");
    expect(loopWhen("0 9 * * 1")).toBe("0 9 * * 1");
    expect(loopRows({b: {at: 2}, a: {at: 1}}).map((loop) => loop.id)).toEqual(["a", "b"]);
});

test("busy agent events in one minute fold into one counted row, newest first", () => {
    const events = ref([
        {id: 1, type: "todo", n: 7, action: "created", at: 60, actor: "agent", data: {}},
        {id: 2, type: "agent", n: 1, action: "updated", at: 120, actor: "system", data: {}},
        {id: 3, type: "agent", n: 1, action: "updated", at: 121, actor: "system", data: {}},
    ]);
    const {items, heading, title} = useActivity(events, (ref) => (ref === "todo:7" ? {title: "Water the plants"} : null));
    expect(items.value.map((item) => item.key)).toEqual(["fold-2", 1]);
    expect(counted(items.value[0].fold.events)).toBe("2 agent updates");
    expect(heading(items.value[1].event)).toBe("New to-do");
    expect(title(items.value[1].event)).toBe("Water the plants");
});
