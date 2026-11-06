import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {transport} from "../src/api/transport.js";
import {watchPresses} from "../src/platform/pressed.js";
import {lineResult} from "../src/windows/windowContext.js";

let answerFetch;
let fetches;

beforeEach(() => {
    fetches = 0;
    vi.stubGlobal("fetch", () => {
        fetches += 1;
        return new Promise((resolve) => (answerFetch = resolve));
    });
    watchPresses();
});

afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
});

const reply = (status, body) => answerFetch(new Response(JSON.stringify(body), {status}));
const settle = () => new Promise((resolve) => setTimeout(resolve));

// a button as a window draws it: its click sends a write through the transport
function drawnButton(handler = () => transport.request("POST", "/api/line", {line: ["task", "close", "1"]})) {
    const button = document.createElement("button");
    button.textContent = "Close";
    button.addEventListener("click", handler);
    document.body.append(button);
    return button;
}

test("a button shows the spinner and is disabled while its request is in flight, and is as it was when it ends", async () => {
    const button = drawnButton();
    button.click();
    expect(button.dataset.busy).toBe("1");
    expect(button.disabled).toBe(true);
    reply(200, {});
    await settle();
    expect(button.dataset.busy).toBeUndefined();
    expect(button.disabled).toBe(false);
});

const asksReadLines = (url) => (url.includes("read-lines") ? Promise.resolve(new Response(JSON.stringify({reads: ["memory list"]}))) : new Promise((resolve) => (answerFetch = resolve)));

test("a line a window writes holds its button too, though it leaves after the click is handled", async () => {
    vi.stubGlobal("fetch", asksReadLines);
    const button = drawnButton(() => lineResult("memories.memories", ["memory", "make", "A memory"], "main"));
    button.click();
    expect(button.dataset.busy).toBe("1");
    await settle();
    await settle();
    expect(button.dataset.busy).toBe("1");
    expect(button.disabled).toBe(true);
    reply(200, {code: 0, value: {}});
    await settle();
    expect(button.dataset.busy).toBeUndefined();
});

const later = () => new Promise((resolve) => setTimeout(resolve, 150));

// the server's list of reads has come, so a line is known to read
async function knowingReads() {
    vi.stubGlobal("fetch", asksReadLines);
    await transport.isRead(["memory", "list"]);
}

test("a read a click asks shows the spinner only after a short wait, and gives the button back when answered", async () => {
    await knowingReads();
    const button = drawnButton(() => lineResult("memories.memories", ["memory", "list"], "main"));
    button.click();
    expect(button.dataset.busy).toBeUndefined();
    await later();
    expect(button.dataset.busy).toBe("1");
    expect(button.disabled).toBe(true);
    reply(200, {code: 0, value: {rows: []}});
    await settle();
    expect(button.dataset.busy).toBeUndefined();
    expect(button.disabled).toBe(false);
});

test("a read answered before the wait never shows the spinner", async () => {
    await knowingReads();
    const button = drawnButton(() => lineResult("memories.memories", ["memory", "list"], "main"));
    button.click();
    await settle();
    await settle();
    await settle();
    reply(200, {code: 0, value: {rows: []}});
    await later();
    expect(button.dataset.busy).toBeUndefined();
    expect(button.disabled).toBe(false);
});

test("a GET a click asks is a read: the spinner after the wait, until it is answered", async () => {
    const button = drawnButton(() => transport.request("GET", "/api/anything"));
    button.click();
    expect(button.dataset.busy).toBeUndefined();
    await later();
    expect(button.dataset.busy).toBe("1");
    reply(200, {});
    await settle();
    expect(button.dataset.busy).toBeUndefined();
});

test("a double click sends one request", async () => {
    const button = drawnButton();
    button.click();
    button.click();
    expect(fetches).toBe(1);
    reply(200, {});
    await settle();
});

test("a request that fails also gives the button back", async () => {
    const failed = vi.fn();
    const button = drawnButton(() => transport.request("POST", "/api/line", {}).catch(failed));
    button.click();
    expect(button.disabled).toBe(true);
    reply(500, {error: "No"});
    await settle();
    expect(failed).toHaveBeenCalledOnce();
    expect(button.dataset.busy).toBeUndefined();
    expect(button.disabled).toBe(false);
});

test("a click that sends no request changes nothing", async () => {
    const button = drawnButton(() => {});
    button.click();
    await settle();
    expect(button.dataset.busy).toBeUndefined();
    expect(button.disabled).toBe(false);
});

test("a button its own window disabled stays disabled when its request ends", async () => {
    const button = drawnButton(() => {
        button.disabled = true;
        return transport.request("POST", "/api/line", {});
    });
    button.click();
    reply(200, {});
    await settle();
    expect(button.disabled).toBe(true);
});

test("a request of a later task is not put on the button clicked before it", async () => {
    const button = drawnButton(() => {});
    button.click();
    await settle();
    transport.request("POST", "/api/line", {});
    expect(button.dataset.busy).toBeUndefined();
    reply(200, {});
    await settle();
});
