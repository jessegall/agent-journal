import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import FrameWindow from "../src/windows/FrameWindow.vue";
import {FrameBridge} from "../src/windows/frameBridge.js";
import {windowContext} from "../src/windows/windowContext.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";

afterEach(() => vi.unstubAllGlobals());

const entry = {name: "notes.board", title: "Notes board", entry_url: "/modules/notes/board.html?v=1", loading: "frame", reads: ["task list"], runs: []};

function frame() {
    const posted = [];
    return {posted, contentWindow: {postMessage: (message) => posted.push(message)}};
}

test("a frame window is a sandboxed frame that may run scripts and has no origin of its own", async () => {
    const element = document.createElement("div");
    createApp(() => h(FrameWindow, {entry, subscriptions: new WindowSubscriptions(), environment: "main"})).mount(element);
    await nextTick();
    const iframe = element.querySelector("iframe");
    expect(iframe.getAttribute("sandbox")).toBe("allow-scripts");
    expect(iframe.getAttribute("src")).toBe(entry.entry_url);
});

test("the bridge sends a frame's line with the frame's own window name, whatever window the frame names", async () => {
    const bodies = [];
    vi.stubGlobal("fetch", async (url, request) => {
        bodies.push(JSON.parse(request.body));
        return {json: async () => ({code: 0, value: {rows: []}, error: ""})};
    });
    const board = frame();
    const context = windowContext({window: "notes.board", environment: "main", agent: null, visible: () => true, permissions: {}, subscriptions: new WindowSubscriptions(), open: () => {}});
    const bridge = new FrameBridge(board, context);
    await bridge.received({source: board.contentWindow, data: {id: 1, type: "read", line: "task list", window: "viewer.shell"}});
    expect(bodies).toEqual([{window: "notes.board", line: ["task", "list"], environment: "main"}]);
    expect(board.posted).toEqual([{id: 1, answer: {ok: true, value: {rows: []}}}]);
});

test("the bridge answers only the frame it made", async () => {
    const board = frame();
    const read = vi.fn();
    const bridge = new FrameBridge(board, {read, run: read, follow: read});
    await bridge.received({source: {}, data: {id: 1, type: "read", line: "task list"}});
    expect(read).not.toHaveBeenCalled();
    expect(board.posted).toEqual([]);
});

test("a frame's follow sends each event it hears back to the frame under the follow's id", async () => {
    const board = frame();
    const subscriptions = new WindowSubscriptions();
    const context = windowContext({window: "notes.board", environment: "main", agent: null, visible: () => true, permissions: {}, subscriptions, open: () => {}});
    const bridge = new FrameBridge(board, context);
    await bridge.received({source: board.contentWindow, data: {id: 4, type: "follow", patterns: ["task.*"]}});
    subscriptions.dispatch({event: "task.create", row_id: 7});
    expect(board.posted).toEqual([{id: 4, answer: {ok: true, value: null}}, {id: 4, answer: {ok: true, value: {event: "task.create", row_id: 7}}}]);
});
