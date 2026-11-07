import {createApp, h} from "vue";
import {afterEach, beforeAll, expect, test, vi} from "vitest";
import MarkHost from "../src/chat/MarkHost.vue";
import {loadMarkDeclarations} from "../src/domain/markRegistry.js";
import {justCompacted} from "../src/domain/figureState.js";

vi.mock("../src/route.js", () => ({go: vi.fn(), peekRef: vi.fn()}));

const DECLARATION = {
    type: "memories.compaction", module: "journal.core.memories", family: "memories.context", family_title: "Context", family_icon: "compact", group: "agent", colouring: "group", variants: ["compacted"],
    label: "Conversation compacted", mark_icon: "compact", click: "nothing", grouping: "never", group_label: "{family}: {count} updates", group_buttons: [], buttons: [], body: "", shown: true, main: true,
    process: false, full_width: true, card: false, shipped: true, unavailable_reason: "",
};
const MARK = {id: 7, type: "memories.compaction", variant: "compacted", text: "Conversation compacted", detail: "", lines: "", state: "ended", target_model: "", target_id: null, outcome: "none", figure: "", fraction: 0,
              created_at: "2026-11-01T10:00:00Z", session_agent_id: 1};
let app;

beforeAll(() => loadMarkDeclarations([DECLARATION]));
afterEach(() => app?.unmount());

test("a compaction mark is drawn as a line across the whole chat with its words", () => {
    const element = document.createElement("div");
    app = createApp({render: () => h(MarkHost, {mark: MARK})});
    app.mount(element);
    expect(element.querySelector(".thread-turn").classList.contains("full-width")).toBe(true);
    expect(element.textContent).toContain("Conversation compacted");
});

test("the agent shows as compacting for a while after a compaction mark", () => {
    const time = Date.parse(MARK.created_at) / 1000;
    expect(justCompacted([{type: MARK.type, time}], time + 2)).toBe(true);
    expect(justCompacted([{type: MARK.type, time}], time + 3600)).toBe(false);
});
