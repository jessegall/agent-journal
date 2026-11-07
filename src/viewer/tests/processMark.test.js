import {afterEach, expect, test, vi} from "vitest";
import {createApp, h, nextTick} from "vue";
import MarkHost from "../src/chat/MarkHost.vue";
import {loadMarkDeclarations} from "../src/domain/markRegistry.js";
import {markLook} from "../src/domain/markLook.js";
import {lineResult, WINDOW_CONTEXT} from "../src/windows/windowContext.js";

const mounted = [];
afterEach(() => {
    mounted.splice(0).forEach((element) => element.remove());
    vi.unstubAllGlobals();
});
const inWindow = (component, props) => createApp(() => h(component, props)).provide(WINDOW_CONTEXT, {environment: "development", run: (line) => lineResult("messages.chat", line, "development")});
const settled = async () => {
    for (let turn = 0; turn < 6; turn++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
};

test("a process mark opens to its run's output and folds on the next click", async () => {
    const asked = [];
    vi.stubGlobal("fetch", async (url, init) => {
        const {attribution, ...line} = JSON.parse(init.body);
        asked.push(line);
        return {json: async () => ({code: 0, value: {lines: ["compiling the cart", "1 failed"], first_byte: 0, last_byte: 30, total: 30}, error: ""})};
    });
    const element = document.createElement("div");
    document.body.append(element);
    mounted.push(element);
    const mark = {id: 1, type: "processes.command", variant: "finished", text: "Ran make build", target_model: "process", target_id: 7, ended_at: "2026-11-01T10:00:00Z", state: "ended"};
    inWindow(MarkHost, {mark}).mount(element);
    await settled();
    element.querySelector("button, [role=button], .chat-mark")?.click();
    await settled();
    expect(asked).toContainEqual({window: "messages.chat", line: ["output", "page", "7"], environment: "development"});
    expect(element.textContent).toContain("compiling the cart");
});

test("a process mark whose output cannot be read says why, not that it printed nothing", async () => {
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 1, value: null, error: "output 7 was pruned"})}));
    const element = document.createElement("div");
    document.body.append(element);
    mounted.push(element);
    const mark = {id: 3, type: "processes.command", variant: "finished", text: "Ran make build", target_model: "process", target_id: 7, ended_at: "2026-11-01T10:00:00Z", state: "ended"};
    inWindow(MarkHost, {mark}).mount(element);
    await settled();
    element.querySelector("button, [role=button], .chat-mark")?.click();
    await settled();
    expect(element.textContent).toContain("output 7 was pruned");
    expect(element.textContent).not.toContain("printed nothing");
});

test("a mark's hover names its time, read from the row's date", () => {
    const look = markLook({id: 4, type: "processes.command", text: "Ran make", created_at: "2026-11-01T10:00:00Z"}, null);
    expect(look.time).toBe(Date.parse("2026-11-01T10:00:00Z") / 1000);
});

test("a mark declared full width draws as a line across the chat", async () => {
    loadMarkDeclarations([{type: "memories.compaction", label: "Conversation compacted", mark_icon: "compact", full_width: true}]);
    const element = document.createElement("div");
    document.body.append(element);
    mounted.push(element);
    inWindow(MarkHost, {mark: {id: 2, type: "memories.compaction", variant: "compacted", text: "Conversation compacted"}}).mount(element);
    await settled();
    expect(element.querySelector(".thread-turn.full-width")).not.toBeNull();
});
