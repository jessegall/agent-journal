import {createApp, defineComponent, h, ref} from "vue";
import {expect, test, vi} from "vitest";
import FrameWindow from "../src/windows/FrameWindow.vue";
import PageWindow from "../src/windows/PageWindow.vue";
import {FrameBridge} from "../src/windows/frameBridge.js";
import {windowContext} from "../src/windows/windowContext.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";

vi.mock("../src/windows/WindowHost.vue", () => ({
    default: defineComponent({
        props: ["options", "declared"],
        setup: (props) => () => h("pre", {class: "host"}, JSON.stringify({options: props.options, declared: props.declared})),
    }),
}));

const DECLARED = [{control: "toggle", key: "hide", label: "Hide", default: false}];
const entry = (loading) => ({name: "notes.board", title: "Board", entry_url: "/modules/notes/board.js?v=1", loading, reads: [], runs: [], events: [], options: DECLARED});
const shown = (window, loading) => {
    const element = document.createElement("div");
    createApp(() => h(window, {entry: entry(loading), subscriptions: new WindowSubscriptions(), environment: "main", options: {hide: true}})).mount(element);
    return JSON.parse(element.querySelector(".host").textContent);
};

test("a page window gives its host the pane's options and the options it declares, which its context.option reads", () => {
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 1, value: null, error: ""})}));
    expect(shown(PageWindow, "component")).toEqual({options: {hide: true}, declared: DECLARED});
});

test("a frame window gives its host the pane's options and the options it declares", () => {
    expect(shown(FrameWindow, "frame")).toEqual({options: {hide: true}, declared: DECLARED});
});

test("a frame asking for an option through the bridge is answered with the pane's value, else the declared default", async () => {
    const posted = [];
    const board = {contentWindow: {postMessage: (message) => posted.push(message)}};
    const options = ref({});
    const context = windowContext({window: "notes.board", environment: "main", visible: () => true, permissions: {}, subscriptions: new WindowSubscriptions(), options, declared: DECLARED});
    const bridge = new FrameBridge(board, context);
    await bridge.received({source: board.contentWindow, data: {id: 1, type: "option", key: "hide"}});
    options.value = {hide: true};
    await bridge.received({source: board.contentWindow, data: {id: 2, type: "option", key: "hide"}});
    expect(posted).toEqual([{id: 1, answer: {ok: true, value: false}}, {id: 2, answer: {ok: true, value: true}}]);
});
