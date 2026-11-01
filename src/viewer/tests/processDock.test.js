import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import MarkButtons from "../src/chat/MarkButtons.vue";
import OutputDock from "../../core/modules/processes/web/src/OutputDock.vue";
import {ref} from "vue";
import {context, mounted, settle} from "./support/windowContext.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));
afterEach(() => vi.unstubAllGlobals());

const DOCK = {icon: "dock", label: "Dock", runs: "dock add processes.output process {row_id}"};
const STOP_WATCHING = {icon: "close", label: "Stop watching", runs: "output unwatch {row_id}"};

// task 5499: a process mark docks its process above the composer, and the card stops watching it
function pressed(button) {
    const lines = [];
    vi.stubGlobal("fetch", async (url, init) => (lines.push(JSON.parse(init.body).line), {json: async () => ({code: 0, value: null, error: ""})}));
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(MarkButtons, {buttons: [button], mark: {target_id: 3}})).mount(element);
    element.querySelector("button").click();
    return lines;
}

test("the Dock button of a process mark adds the process to the dock", async () => {
    const lines = pressed(DOCK);
    await settle();
    expect(lines).toEqual([["dock", "add", "processes.output", "process", "3"]]);
});

test("the card of a docked process stops watching it with its button", async () => {
    const lines = pressed(STOP_WATCHING);
    await settle();
    expect(lines).toEqual([["output", "unwatch", "3"]]);
});

test("a docked process's card shows the run live: its state and the last lines of its reader", async () => {
    const window = context({
        "process show 3": {ok: true, value: {id: 3, state: "running", line: "make build"}},
        "output peek 3": {ok: true, value: {lines: ["compiling the cart", "[ 40%]"]}},
    });
    window.option = () => ref({id: 7, target_id: 3});
    const element = await mounted(OutputDock, window);
    expect(element.querySelector(".output-dock-state").textContent).toBe("running");
    expect(element.querySelector(".output-dock-line").textContent).toBe("make build");
    expect(element.querySelector(".output-dock-lines").textContent).toBe("compiling the cart\n[ 40%]");
});
