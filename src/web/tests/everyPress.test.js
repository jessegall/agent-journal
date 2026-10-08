import {afterAll, describe, expect, test, vi} from "vitest";
import {loadDemo} from "../demo/data.js";
import {StandIn} from "../demo/standIn.js";
import {QuietStream} from "../demo/stream.js";
import {PAGES} from "../src/route.js";

const CONTROLS = 'button, [role="button"], [role="switch"], [role="menuitem"]';
const PRESSES_PER_PAGE = 150;
const seen = new Set();
const SETTLE_TURNS = 3;
const BOOT_WAIT_MS = 8000;
const IDLE_TUNNEL = {installed: true, logged_in: true, command: "", host: "", server: "", address: "", problems: []};
const UNKNOWN = "The test journal does not know this";
const SHAPES = {"/todo/board": {loaded: true, lanes: [], lens: {}}};

let sent = [];
let held = [];
let pressing = false;
let chooser = false;

const settle = async (turns = SETTLE_TURNS) => {
    for (let turn = 0; turn < turns; turn++) {
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
};

const look = () => `${location.hash}|${document.body.innerHTML.replace(/ data-busy="\d+"/g, "")}`;

const nameOf = (control) =>
    `${control.tagName.toLowerCase()} "${(control.getAttribute("aria-label") || control.title || control.textContent).trim().slice(0, 40)}"`;

const alreadySet = (control) =>
    ["aria-selected", "aria-checked", "aria-pressed", "aria-current"].some((name) => control.getAttribute(name) === "true");

const covered = (control) => {
    const stage = [...document.querySelectorAll(".focus-stage")].find((s) => s.style.display !== "none");
    return Boolean(stage) && !stage.contains(control);
};

const usable = (control) =>
    !control.disabled &&
    control.getAttribute("aria-disabled") !== "true" &&
    control.getAttribute("tabindex") !== "-1" &&
    !control.closest("[inert], [aria-hidden='true']") &&
    !covered(control);

const Quiet = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

async function mountPage(page) {
    vi.resetModules();
    document.body.replaceChildren();
    window.matchMedia = () => ({matches: false, addEventListener() {}, removeEventListener() {}});
    globalThis.ResizeObserver = Quiet;
    globalThis.IntersectionObserver = Quiet;
    globalThis.EventSource = QuietStream;
    Element.prototype.scrollIntoView = () => {};
    window.close = () => {};
    HTMLInputElement.prototype.click = () => (chooser = true);
    localStorage.clear();
    const standIn = new StandIn(await loadDemo());
    globalThis.demo = standIn;
    const {transport} = await import("../src/api/transport.js");
    transport.reach = async (method, url, body) => {
        sent.push(`${method} ${url}`);
        if (method !== "GET" && pressing) await new Promise((resolve) => held.push(resolve));
        const answer = await standIn.answer(method, url, body);
        const text = await answer.clone().text();
        if (!text.includes('"demo":true')) return answer;
        if (/\/share\/(check_)?tunnel$/.test(url)) return new Response(JSON.stringify(IDLE_TUNNEL), {status: 200});
        const shape = Object.entries(SHAPES).find(([ending]) => url.endsWith(ending));
        return shape ? new Response(JSON.stringify(shape[1]), {status: 200}) : new Response(JSON.stringify({error: UNKNOWN}), {status: 404});
    };
    (await import("../src/platform/pressed.js")).watchPresses();
    const into = document.createElement("div");
    into.id = "app";
    document.body.append(into);
    location.hash = `#/main/${page}`;
    const {default: App} = await import("../src/App.vue");
    const {tip} = await import("../src/kit/tip.js");
    const {createApp} = await import("vue");
    const app = createApp(App).directive("tip", tip);
    app.mount(into);
    await settle(8);
    const {store} = await import("../src/state/store.js");
    await settle();
    if (!store.settings) store.settings = await (await import("../src/api/client.js")).api.settings();
    await settle();
    return app;
}

async function press(control) {
    sent = [];
    held = [];
    const before = look();
    chooser = false;
    pressing = true;
    const at = {bubbles: true, button: 0, clientX: 1, clientY: 1};
    control.dispatchEvent(new MouseEvent("pointerdown", at));
    control.dispatchEvent(new MouseEvent("pointerup", at));
    control.click();
    await settle();
    pressing = false;
    const requested = sent.some((line) => !line.startsWith("GET "));
    const feedback = control.isConnected ? control.dataset.busy !== undefined : true;
    const moved = look() !== before || chooser;
    held.forEach((release) => release());
    await settle();
    return {requested, feedback, moved, stuck: control.isConnected && control.dataset.busy !== undefined};
}

async function pressEverything(page) {
    const app = await mountPage(page);
    if (process.env.PRESS_LOG) console.log(`spec ${Boolean((await import("../src/state/store.js")).store.spec)} hash ${location.hash} search ${location.search} booted ${(await import("../src/state/store.js")).store.booted} body: ${document.body.innerHTML.slice(0, 300)} sent ${sent.join(" ")}`);
    const pressed = new Set();
    const failures = [];
    while (pressed.size < PRESSES_PER_PAGE) {
        const control = [...document.querySelectorAll(CONTROLS)].find((c) => usable(c) && !seen.has(nameOf(c)));
        if (!control) break;
        pressed.add(nameOf(control));
        seen.add(nameOf(control));
        const where = nameOf(control);
        const result = await press(control);
        if (!result.requested && !result.moved && !alreadySet(control)) failures.push(`${page}: ${where} sent no request and changed nothing ${control.outerHTML.slice(0, 160)}`);
        if (result.requested && !result.feedback && !result.moved) failures.push(`${page}: ${where} sent a request and showed nothing while it waited`);
        if (result.stuck) failures.push(`${page}: ${where} stayed busy after the answer`);
        if (!document.getElementById("app")) break;
    }
    try {
        app.unmount();
    } catch (error) {
        if (process.env.PRESS_LOG) console.log(`${page}: closing threw ${error.message}`);
    }
    return failures;
}

describe.skipIf(!process.env.PRESS_EVERYTHING)("every control on every page", () => {
    test.each(["", ...PAGES])("page %j: each press sends a request or changes the page, and shows it is working", async (page) => {
        expect(await pressEverything(page)).toEqual([]);
    }, 120000);
});
