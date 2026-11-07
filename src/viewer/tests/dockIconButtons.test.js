import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {settled} from "./settled.js";
import {context as windowContext, perLine} from "./support/windowContext.js";
import DockWrapper from "../src/chat/DockWrapper.vue";
import {dockLook} from "../src/domain/dockLook.js";

const dockButtons = (item, declaration) => dockLook(item, declaration).buttons;
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";

const STOP = {icon: "stop", label: "Stop", runs: "output stop {row_id}"};
const DECLARATION = {type: "processes.output", icon: "terminal", title: "Output {row_id}", buttons: [STOP], leaves_after_seconds: 5, reads: ["process show"]};
const ITEM = {id: 5, type: "processes.output", target_model: "processes", target_id: 3, kept: false, leaves_at: null};
let mounted = [];

afterEach(() => {
    mounted.forEach((element) => element.remove());
    mounted = [];
    vi.unstubAllGlobals();
});

async function drawn(item = ITEM) {
    loadDockDeclarations([DECLARATION]);
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    vi.stubGlobal("fetch", perLine(async () => ({json: async () => ({code: 0, value: null, error: ""})})));
    const element = document.createElement("div");
    document.body.append(element);
    createApp({setup: () => () => h(DockWrapper, {item}), provide: {[WINDOW_CONTEXT]: windowContext({})}}).mount(element);
    mounted.push(element);
    await settled();
    return element;
}

test("the pin and the stop of a docked card are icon buttons named by their words", () => {
    const buttons = dockButtons(ITEM, DECLARATION);
    expect(buttons.find((button) => button.action === "keep")).toMatchObject({icon: "pins", label: "Keep this card", iconOnly: true});
    expect(buttons.find((button) => button.action === "declared")).toMatchObject({icon: "stop", label: "Stop", iconOnly: false});
    expect(dockButtons({...ITEM, kept: true}, DECLARATION).find((button) => button.action === "unkeep")).toMatchObject({icon: "pins", label: "Let this card close", iconOnly: true});
});

test("a docked card draws its pin and stop as an icon with the words as label and tooltip, and no text", async () => {
    const element = await drawn();
    for (const [action, words] of [["keep", "Keep this card"]]) {
        const button = element.querySelector(`[data-dock-action='${action}']`);
        expect(button.classList.contains("icon")).toBe(true);
        expect(button.getAttribute("aria-label")).toBe(words);
        expect(button.getAttribute("title")).toBe(words);
        expect(button.textContent.trim()).toBe("");
        expect(button.querySelector("svg")).not.toBeNull();
    }
});

test("pressing the stop icon runs the stop line", async () => {
    const lines = [];
    const element = await drawn();
    vi.stubGlobal("fetch", async (url, init) => (lines.push(JSON.parse(init.body).line), {json: async () => ({code: 0, value: null, error: ""})}));
    element.querySelector("[data-dock-action='declared']").click();
    await settled();
    expect(lines).toEqual([["output", "stop", "3"]]);
});
