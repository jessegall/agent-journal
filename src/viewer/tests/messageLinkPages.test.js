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
const idsOf = (line) => (line.match(/--messages ([\d,]+)/)?.[1] ?? "").split(",").filter(Boolean);
// the answer of `link receipts` for the messages a line names: each gets the named page and the sent page `make` gives it
const receipts = (line, make = () => ({named: empty().value, sent: empty().value})) => ({ok: true, value: {messages: Object.fromEntries(idsOf(line).map((id) => [id, make(Number(id))]))}});

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
    const windowContext = receiptWindow(async (line) => (requests.push(line), receipts(line)));
    await cards(windowContext, [1, 2]);
    const before = requests.length;
    for (let at = 0; at < 20; at++) windowContext.subscriptions.dispatch({event: "link.create", source_model: "message", source_id: 1, link_type: "about"});
    await settle();
    expect(requests.slice(before)).toHaveLength(1);
    expect(requests.at(-1)).toBe("link receipts --messages 1");
});

test("an event without endpoint data refreshes at most one visible page", async () => {
    const requests = [];
    const windowContext = receiptWindow(async (line) => (requests.push(line), receipts(line)));
    await cards(windowContext, Array.from({length: 60}, (_, at) => at + 1));
    const before = requests.length;
    for (let at = 0; at < 10; at++) windowContext.subscriptions.dispatch({event: "link.create"});
    await settle();
    expect(requests.slice(before)).toHaveLength(1);
    expect(idsOf(requests.at(-1))).toHaveLength(50);
});

test("a page of messages reads its links in one request", async () => {
    const requests = [];
    const windowContext = receiptWindow(async (line) => (requests.push(line), receipts(line)));
    await cards(windowContext, Array.from({length: 10}, (_, at) => at + 1));
    expect(requests).toEqual([`link receipts --messages ${Array.from({length: 10}, (_, at) => at + 1).join(",")}`]);
});

test("receipt pages preserve titles and open server targets", async () => {
    const endpoint = (model, id, title, open_ref) => ({endpoint: {model, id, title, open_ref, exists: true, unavailable: false}, relations: ["about", "edited"], link_ids: [id]});
    const requests = [];
    const first = {counterparts: [endpoint("task_log", 12, "Audit totals", "tasks:4"), ...Array.from({length: 9}, (_, at) => endpoint("task", at + 5, `Task ${at + 5}`, `tasks:${at + 5}`))], rows: [], total: 11, next_page: 2};
    const windowContext = receiptWindow(async (line) => {
        requests.push(line);
        if (line.startsWith("link receipts")) return receipts(line, () => ({named: first, sent: empty().value}));
        return {ok: true, value: {counterparts: [endpoint("phase", 21, "Approved phase", "plans:1")], rows: [], total: 11, next_page: null}};
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
    expect(requests).toEqual(["link receipts --messages 1", "link list --source message:1 --type about --type edited --group-counterparts --page 2 --page-size 10"]);
});

test("a missing target remains a disabled receipt", async () => {
    const missing = {counterparts: [{endpoint: {model: "task", id: 99, title: "Task unavailable", exists: false, unavailable: true, open_ref: null}, relations: ["about"], link_ids: [1]}], total: 1};
    const windowContext = receiptWindow(async (line) => receipts(line, () => ({named: missing, sent: empty().value})));
    const host = await cards(windowContext, [1]);
    expect(host.querySelector("[data-message-links]").textContent).toContain("unavailable");
    expect(host.querySelector(".message-links-inline").disabled).toBe(true);
});

test("the receipts of several messages go in one line of the batch route", async () => {
    const sent = [];
    vi.stubGlobal("fetch", async (url, init) => {
        if (url === "/api/read-lines") return {ok: true, status: 200, json: async () => ({reads: ["link receipts"]})};
        const body = JSON.parse(init.body);
        sent.push({url, body});
        const answers = (body.lines ?? [body]).map((entry) => ({code: 0, value: receipts(entry.line.join(" ")).value}));
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
    expect(JSON.stringify(sent.at(-1).body)).toContain("link");
    expect(JSON.stringify(sent.at(-1).body)).toContain("receipts");
    expect(JSON.stringify(sent.at(-1).body)).toContain("1,2");
});
