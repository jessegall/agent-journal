import {afterEach, expect, test, vi} from "vitest";
import {createApp, h, nextTick} from "vue";
import MarkHost from "../src/chat/MarkHost.vue";
import {loadMarkDeclarations} from "../src/domain/markRegistry.js";

const mounted = [];
afterEach(() => {
    mounted.splice(0).forEach((element) => element.remove());
    vi.unstubAllGlobals();
});
const settled = async () => {
    for (let turn = 0; turn < 6; turn++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
};

test("a process mark opens to its run's output and folds on the next click", async () => {
    const asked = [];
    vi.stubGlobal("fetch", async (url, init) => {
        asked.push(JSON.parse(init.body).line);
        return {json: async () => ({code: 0, value: {lines: ["compiling the cart", "1 failed"]}, error: ""})};
    });
    const element = document.createElement("div");
    document.body.append(element);
    mounted.push(element);
    const mark = {id: 1, type: "processes.command", variant: "finished", text: "Ran make build", target_model: "process", target_id: 7, ended_at: "2026-11-01T10:00:00Z", state: "ended"};
    createApp(() => h(MarkHost, {mark})).mount(element);
    await settled();
    element.querySelector("button, [role=button], .chat-mark")?.click();
    await settled();
    expect(asked).toContainEqual(["output", "peek", "7", "--all"]);
    expect(element.textContent).toContain("compiling the cart");
});

test("a mark declared full width draws as a line across the chat", async () => {
    loadMarkDeclarations([{type: "memories.compaction", label: "Conversation compacted", mark_icon: "compact", full_width: true}]);
    const element = document.createElement("div");
    document.body.append(element);
    mounted.push(element);
    createApp(() => h(MarkHost, {mark: {id: 2, type: "memories.compaction", variant: "compacted", text: "Conversation compacted"}})).mount(element);
    await settled();
    expect(element.querySelector(".thread-turn.full-width")).not.toBeNull();
});
