import {afterEach, beforeEach, expect, test, vi} from "vitest";

const SCOPE = "http://127.0.0.1:8000/";
let handlers;
let shown;
let opened;
let posted;
let focused;

async function worker({waiting = [], windows = []} = {}) {
    handlers = {};
    shown = [];
    opened = [];
    posted = [];
    focused = 0;
    const self = {
        addEventListener: (name, handler) => (handlers[name] = handler),
        registration: {scope: SCOPE, showNotification: async (title, options) => shown.push({title, ...options})},
        clients: {
            matchAll: async () => windows.map(() => ({postMessage: (message) => posted.push(message), focus: async () => (focused += 1)})),
            openWindow: async (url) => opened.push(url),
            claim: async () => {},
        },
        navigator: {},
        location: {origin: "http://127.0.0.1:8000"},
        skipWaiting: () => {},
    };
    vi.stubGlobal("self", self);
    vi.stubGlobal("fetch", async () => ({ok: true, json: async () => ({waiting})}));
    vi.resetModules();
    await import("../../../tools/phone-worker/phone-sw.js");
}

async function fired(name, event) {
    let done = null;
    handlers[name]({...event, waitUntil: (promise) => (done = promise)});
    await done;
}

beforeEach(() => vi.stubGlobal("caches", {open: async () => ({keys: async () => [], match: async () => null, put: async () => {}, add: async () => {}, delete: async () => {}}), keys: async () => [], delete: async () => {}}));
afterEach(() => vi.unstubAllGlobals());

test("a push for one thing says the agent needs you and shows nothing of what waits", async () => {
    await worker({waiting: [{ref: "questions:4", text: "Which colour for the button?"}]});
    await fired("push", {});
    expect(shown).toHaveLength(1);
    expect(shown[0].title).toBe("Your agent needs you");
    expect(shown[0].body).toBe("Open the journal to see what waits.");
    expect(JSON.stringify(shown[0])).not.toContain("colour");
});

test("a push for several things counts them", async () => {
    await worker({waiting: [{ref: "questions:4"}, {ref: "questions:5"}]});
    await fired("push", {});
    expect(shown[0].title).toBe("2 things need you");
});

test("a tap with no viewer open opens the window that holds what waits", async () => {
    await worker();
    await fired("notificationclick", {notification: {close: () => {}, data: {ref: "questions:4"}}});
    expect(opened).toEqual(["/viewer/#open=questions%3A4"]);
});

test("a tap with the viewer open focuses it and tells it what to open", async () => {
    await worker({windows: [{}]});
    await fired("notificationclick", {notification: {close: () => {}, data: {ref: "questions:4"}}});
    expect(posted).toEqual([{open: "questions:4"}]);
    expect(focused).toBe(1);
});
