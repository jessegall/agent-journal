import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {settled} from "./settled.js";
import PhoneNotify from "../src/windows/PhoneNotify.vue";
import PaneStage from "../src/windows/PaneStage.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {paneLayout} from "../src/windows/paneLayout.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";

const PUBLIC_KEY = "BAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0-P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1g";
const SUBSCRIPTION = {endpoint: "https://fcm.googleapis.com/fcm/send/abc", keys: {p256dh: "x", auth: "y"}};
let subscribed;
let posts;
let mounted = [];

function fakeWorker({supported = true} = {}) {
    subscribed = [];
    const registration = {pushManager: supported ? {subscribe: async (options) => (subscribed.push(options), {toJSON: () => SUBSCRIPTION})} : undefined};
    vi.stubGlobal("navigator", {serviceWorker: {ready: Promise.resolve(registration), addEventListener: () => {}}});
}

function fakeNotification(permission, answer = "granted") {
    const requestPermission = vi.fn(async () => answer);
    vi.stubGlobal("Notification", Object.assign(function Notification() {}, {permission, requestPermission}));
    return requestPermission;
}

async function mountedOffer() {
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(PhoneNotify)).mount(element);
    mounted.push(element);
    await settled();
    return element;
}

const button = (element) => element.querySelector("button.phone-notify");

beforeEach(() => {
    posts = [];
    localStorage.clear();
    vi.stubGlobal("requestAnimationFrame", (run) => setTimeout(run, 0));
    vi.stubGlobal("fetch", async (url, request) => {
        if (url !== "/api/push") return {json: async () => ({code: 0, value: {rows: [], total: 0}, error: ""})};
        if (request?.method === "POST") posts.push({url, body: JSON.parse(request.body)});
        return {ok: true, json: async () => (request?.method === "POST" ? {subscribed: true} : {public_key: PUBLIC_KEY})};
    });
});

afterEach(() => {
    mounted.forEach((element) => element.remove());
    mounted = [];
    vi.unstubAllGlobals();
});

test("a phone that can take notices and has not been asked is offered them on a button", async () => {
    fakeWorker();
    fakeNotification("default");
    expect(button(await mountedOffer()).textContent).toContain("notices");
});

test("a tap asks for permission, subscribes with the journal's public key and posts the subscription", async () => {
    fakeWorker();
    const requestPermission = fakeNotification("default");
    const element = await mountedOffer();
    button(element).click();
    await settled();
    expect(requestPermission).toHaveBeenCalledTimes(1);
    expect(subscribed).toHaveLength(1);
    expect(subscribed[0].userVisibleOnly).toBe(true);
    expect([...new Uint8Array(subscribed[0].applicationServerKey)].slice(0, 3)).toEqual([4, 1, 2]);
    expect(posts).toEqual([{url: "/api/push", body: SUBSCRIPTION}]);
    expect(button(element)).toBeNull();
});

test("the offer is made once: after a tap, even a refusal, a later visit shows no button", async () => {
    fakeWorker();
    fakeNotification("default", "denied");
    const element = await mountedOffer();
    button(element).click();
    await settled();
    expect(posts).toEqual([]);
    expect(subscribed).toEqual([]);
    expect(button(await mountedOffer())).toBeNull();
});

test("nothing is offered when notices are already allowed or blocked, or the phone cannot push", async () => {
    fakeWorker();
    fakeNotification("granted");
    expect(button(await mountedOffer())).toBeNull();
    fakeNotification("denied");
    expect(button(await mountedOffer())).toBeNull();
    fakeWorker({supported: false});
    fakeNotification("default");
    expect(button(await mountedOffer())).toBeNull();
});

test("the phone face carries the offer above its bar, and the person's face does not", async () => {
    fakeWorker();
    fakeNotification("default");
    const layout = {dir: "row", r: 0.5, a: {tabs: ["tasks.tasks"], active: "tasks.tasks"}, b: {tabs: ["messages.chat"], active: "messages.chat"}};
    const entry = (name) => ({name, title: "Tasks", icon: "window", options: [], line: "task list", loading: "document", reads: [], runs: [], events: [], unavailable_reason: "", allowed: true});
    const stage = async (face) => {
        const store = paneLayout({saved: async () => null, defaults: async () => layout, save: async () => ({ok: true, version: 1}), tab: {read: () => null, write: () => {}}, entry});
        await store.load({environment: "main", person: 1, suite: "coding", page: "home", driver: "coding.builder"});
        const catalogue = new WindowCatalogue(async () => ({windows: []}));
        catalogue.windows.value = [entry("tasks.tasks"), entry("messages.chat")];
        const element = document.createElement("div");
        document.body.append(element);
        createApp(() => h(PaneStage, {store, catalogue, subscriptions: new WindowSubscriptions(), environment: "main", face})).mount(element);
        mounted.push(element);
        await settled();
        return element;
    };
    vi.stubGlobal("innerWidth", 400);
    expect(button(await stage("phone"))).not.toBeNull();
    expect(button(await stage("person"))).toBeNull();
});
