import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import MarkHost from "../src/chat/MarkHost.vue";
import DockWrapper from "../src/chat/DockWrapper.vue";
import ButtonAllowance from "../src/windows/ButtonAllowance.vue";
import {loadMarkDeclarations} from "../src/domain/markRegistry.js";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {buttonCatalogue} from "../src/domain/buttons.js";
import {pressButton} from "../src/chat/markButtons.js";
import {startWindows} from "../src/windows/startup.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {perLine, pickButton, settle} from "./support/windowContext.js";
import {dockWindow} from "./support/dockWindow.js";

const BUTTON = {module: "acme.review", icon: "words", label: "Review", runs: "note review {row_id}"};
const PERMISSION = {label: "Review", line: BUTTON.runs};
const mounted = [];

afterEach(() => {
    mounted.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function started({missing = true, share = false} = {}) {
    const writes = [];
    const reads = [];
    let missingLines = missing ? [PERMISSION] : [];
    vi.stubGlobal("fetch", perLine(async (url, init) => {
        if (String(url).startsWith("/api/buttons")) {
            reads.push(url);
            return {ok: !share, status: share ? 403 : 200, json: async () => ({buttons: [], missing: missingLines.length ? {"acme.review": missingLines} : {}})};
        }
        const {attribution, ...body} = JSON.parse(init.body);
        writes.push(body);
        if (body.line.slice(0, 2).join(" ") === "window allow") missingLines = [];
        return {ok: true, json: async () => ({code: 0, value: null, error: ""})};
    }));
    let heard;
    const windows = startWindows({environment: "main", catalogue: {load: async () => {}, heard: async () => {}},
        events: (_, listener) => { heard = listener; return () => {}; }, session: async () => ({type: share ? "share" : "person"})});
    await settle();
    return {windows, writes, reads, heard, change: (lines) => { missingLines = lines; }};
}

async function drawn(windows, component, props) {
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h("div", [h(component, props), h(ButtonAllowance, {prompts: windows.prompts})])});
    app.provide(WINDOW_CONTEXT, dockWindow());
    app.mount(element);
    mounted.push(app);
    await settle();
    return document.body;
}

test.each(["mark", "dock"])("a third party's %s asks with its label and line, and Allow runs it", async (place) => {
    const {windows, writes} = await started();
    loadMarkDeclarations([{type: "acme.note", module: BUTTON.module, shipped: false, buttons: [BUTTON]}]);
    loadDockDeclarations([{type: "acme.note", module: BUTTON.module, shipped: false, buttons: [BUTTON]}]);
    const item = {id: 7, type: "acme.note", target_model: "note", target_id: 12};
    const element = await drawn(windows, place === "mark" ? MarkHost : DockWrapper, place === "mark" ? {mark: item} : {item});
    element.querySelector(place === "mark" ? ".mark-button" : '[data-dock-action="declared"]').click();
    await settle();
    expect(element.querySelector('[role="dialog"]').textContent).toContain("Review: note review {row_id}");
    expect(writes.filter((body) => body.line[0] === "note")).toEqual([]);
    await pickButton(element, "Allow");
    await settle();
    expect(writes).toContainEqual({window: "viewer.shell", line: ["window", "allow", "button:acme.review", "--type", "runs"], environment: "main"});
    expect(writes).toContainEqual({window: "messages.chat", line: ["note", "review", "12"], environment: "main"});
    expect(element.querySelector('[role="dialog"]')).toBeNull();
});

test("Not now sends neither allowance nor command", async () => {
    const {windows, writes} = await started();
    const element = await drawn(windows, "span", {});
    const result = pressButton(BUTTON, {id: 12}, "main");
    await settle();
    await pickButton(element, "Not now");
    expect(await result).toMatchObject({ok: false});
    expect(writes.filter((body) => ["window", "note"].includes(body.line[0]))).toEqual([]);
});

test("a shipped button never asks", async () => {
    const {windows, writes} = await started({missing: false});
    expect(await pressButton({...BUTTON, module: "journal.core.notes"}, {id: 12}, "main")).toMatchObject({ok: true});
    expect(windows.prompts.current.value).toBeNull();
    expect(writes.filter((body) => body.line[0] === "window")).toEqual([]);
});

test("a changed allowance is fetched on the next press and asks again", async () => {
    const {windows, change} = await started({missing: false});
    await pressButton(BUTTON, {id: 12}, "main");
    change([{label: "Review with a message", line: "note review {row_id} --message={message}"}]);
    const sent = pressButton({...BUTTON, runs: "note review {row_id} --message={message}"}, {id: 12}, "main", {message: "Check this"});
    await settle();
    expect(windows.prompts.current.value.lines).toEqual(["Review with a message: note review {row_id} --message={message}"]);
    windows.prompts.answer(false);
    expect(await sent).toMatchObject({ok: false});
});

test("the suite setting and registry fingerprint reload the environment's buttons", async () => {
    const {heard, reads} = await started();
    const count = reads.length;
    await heard({event: "setting.edit", data: {key: ["suite", "suite"]}});
    expect(reads).toHaveLength(count + 1);
    await heard({event: "setting.edit", data: {key: ["theme", "theme"]}});
    expect(reads).toHaveLength(count + 1);
    await heard({event: "registry.sync", data: {fingerprint: ["old", "new"]}});
    expect(reads).toHaveLength(count + 2);
    await heard({event: "setting.edit"});
    expect(reads).toHaveLength(count + 3);
    expect(reads.every((url) => url === "/api/buttons?environment=main")).toBe(true);
});

test("a share session's 403 loads no buttons", async () => {
    await started({share: true});
    expect(buttonCatalogue("main").offers.value).toEqual({buttons: [], missing: {}});
});
