import {afterEach, expect, test, vi} from "vitest";
import {h} from "vue";
import {context, mounted} from "./support/codingWindowContext.js";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {peekRef} from "../src/route.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));
vi.stubGlobal("matchMedia", () => ({matches: true}));
vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => {
    document.body.innerHTML = "";
    peekRef.mockClear();
});

const TABS = [{key: "tasks", label: "Tasks", read: "usage agents", count_field: "tasks"}];
const opened = (row) => mounted({render: () => h(AgentCard, {row, facts: {tasks: []}, open: true})}, {...context({}), tabs: TABS});

test.each([["an agent", {id: 4, session: "s-two", program: "claude", role: "worker", ended_at: null}], ["a helper", {id: 3, session: "s-sub", program: "claude", role: "helper", ended_at: null}]])("the opened card of %s has a button that opens its inspector", async (_, row) => {
    const element = await opened(row);
    element.querySelector("[data-agent-inspector]").click();
    expect(peekRef).toHaveBeenCalledWith(`agents:${row.id}`);
});
