import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import MessageCard from "../kit/MessageCard.vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";
import {context, settle} from "./support/windowContext.js";
import {lineResult} from "../src/windows/windowContext.js";

const apps = [];
afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
    location.hash = "";
});
const empty = () => ({ok: true, value: {rows: [], counterparts: [], total: 0, next_page: null}});

function receiptWindow(read) {
    const base = context({});
    return {...base, read, follow: (patterns, heard) => base.subscriptions.follow("receipts", patterns, heard)};
}

async function cards(windowContext, ids) {
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h("div", ids.map((id) => h(MessageCard, {key: id, message: {id, type: "user", text: `Request ${id}`, created_at: "2026-11-01T10:00:00Z"}})))});
    app.provide(WINDOW_CONTEXT, windowContext);
    app.mount(host);
    apps.push(app);
    await settle();
    return host;
}

test("a burst refreshes only its affected receipt once", async () => {
    const requests = [];
    const windowContext = receiptWindow(async (line) => (requests.push(line), empty()));
    await cards(windowContext, [1, 2]);
    const before = requests.length;
    for (let at = 0; at < 20; at++) windowContext.subscriptions.dispatch({event: "link.create", source_model: "message", source_id: 1, link_type: "about"});
    await settle();
    expect(requests.slice(before)).toHaveLength(1);
    expect(requests.at(-1)).toContain("--source message:1");
    expect(requests.at(-1)).toContain("--type edited");
});

test("an event without endpoint data refreshes at most one visible page", async () => {
    const requests = [];
    const windowContext = receiptWindow(async (line) => (requests.push(line), empty()));
    await cards(windowContext, Array.from({length: 60}, (_, at) => at + 1));
    const before = requests.length;
    for (let at = 0; at < 10; at++) windowContext.subscriptions.dispatch({event: "link.create"});
    await settle();
    expect(requests.slice(before)).toHaveLength(100);
});

test("receipt pages preserve titles and open server targets", async () => {
    const endpoint = (model, id, title, open_ref) => ({endpoint: {model, id, title, open_ref, exists: true, unavailable: false}, relations: ["about", "edited"], link_ids: [id]});
    const requests = [];
    const windowContext = receiptWindow(async (line) => {
        requests.push(line);
        if (line.includes("sent_to")) return empty();
        const second = line.includes("--page 2 ");
        const rows = second ? [endpoint("phase", 21, "Approved phase", "plans:1")] : [endpoint("task_log", 12, "Audit totals", "tasks:4"), ...Array.from({length: 9}, (_, at) => endpoint("task", at + 5, `Task ${at + 5}`, `tasks:${at + 5}`))];
        return {ok: true, value: {counterparts: rows, rows: [], total: 11, next_page: second ? null : 2}};
    });
    const host = await cards(windowContext, [1]);
    host.querySelector("[data-message-links-count]").click();
    await settle();
    expect(host.textContent).toContain("Audit totals");
    host.querySelector("[data-page-more]").click();
    await settle();
    expect(host.querySelectorAll(".message-links-row")).toHaveLength(11);
    host.querySelector(".message-links-row").click();
    await settle();
    expect(location.hash).toContain("tasks:4");
    expect(requests.every((line) => line.startsWith("link list"))).toBe(true);
});

test("a missing target remains a disabled receipt", async () => {
    const windowContext = receiptWindow(async (line) => line.includes("sent_to") ? empty() : ({ok: true, value: {counterparts: [{endpoint: {model: "task", id: 99, title: "Task unavailable", exists: false, unavailable: true, open_ref: null}, relations: ["about"], link_ids: [1]}], total: 1}}));
    const host = await cards(windowContext, [1]);
    expect(host.querySelector("[data-message-links]").textContent).toContain("unavailable");
    expect(host.querySelector(".message-links-inline").disabled).toBe(true);
});

test("affected receipt reads use the existing lines batch route", async () => {
    const sent = [];
    vi.stubGlobal("fetch", async (url, init) => {
        if (url === "/api/read-lines") return {ok: true, status: 200, json: async () => ({reads: ["link list"]})};
        const body = JSON.parse(init.body);
        sent.push({url, body});
        const answers = (body.lines ?? [body]).map(() => ({code: 0, value: empty().value}));
        return {ok: true, status: 200, json: async () => body.lines ? {answers} : answers[0]};
    });
    const windowContext = receiptWindow((line) => lineResult("messages.chat", line, "main"));
    await cards(windowContext, [1, 2, 3]);
    await expect.poll(() => sent.length).toBe(1);
    await settle();
    const before = sent.length;
    for (let at = 0; at < 10; at++) {
        windowContext.subscriptions.dispatch({event: "link.create", source_model: "message", source_id: 1, link_type: "edited"});
        windowContext.subscriptions.dispatch({event: "link.create", source_model: "message", source_id: 2, link_type: "about"});
    }
    await expect.poll(() => sent.length).toBe(before + 1);
    expect(sent.at(-1).url).toContain("/api/lines");
    expect(sent.at(-1).body.lines).toHaveLength(2);
});
