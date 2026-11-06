import {afterEach, expect, test} from "vitest";
import MessageCard from "../kit/MessageCard.vue";
import PlanLinks from "../src/resource/PlanLinks.vue";
import DocumentInspector from "../src/resource/document/DocumentInspector.vue";
import TranscriptionRows from "../../core/modules/transcriptions/web/src/TranscriptionRows.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {linkPage} from "./support/linkPages.js";

const REQUEST = {id: 1, type: "user", text: "Fix the cart totals", created_at: "2026-11-01T10:00:00Z"};

afterEach(() => (document.body.innerHTML = ""));

function receiptContext(rows = []) {
    const requests = [];
    const base = context({});
    return {
        ...base,
        requests,
        read: async (line) => {
            const words = Array.isArray(line) ? line : line.split(" ");
            requests.push(words);
            return words[0] === "link" ? linkPage(rows, words) : page([]);
        },
        follow: (patterns, heard) => base.subscriptions.follow("receipt", patterns, heard),
    };
}

test("the receipt fixture renders the real message and requests its links", async () => {
    const windowContext = receiptContext();
    const element = await mounted(MessageCard, windowContext, {message: REQUEST});
    expect(element.textContent).toContain(REQUEST.text);
    expect(windowContext.requests.some((line) => line.slice(0, 2).join(" ") === "link list")).toBe(true);
});

const EDGE = {id: 1, source_model: "message", source_id: 1, target_model: "task", target_id: 4, source_title: "Request", target_title: "Cart totals", link_type: "about"};

test("task 6895: another message's link event leaves this receipt alone", async () => {
    const windowContext = receiptContext();
    await mounted(MessageCard, windowContext, {message: REQUEST});
    const before = windowContext.requests.length;
    windowContext.subscriptions.dispatch({event: "link.create", source_model: "message", source_id: 9});
    await settle();
    expect(windowContext.requests).toHaveLength(before);
});

test("a receipt refreshes when its own link changes", async () => {
    const windowContext = receiptContext();
    await mounted(MessageCard, windowContext, {message: REQUEST});
    const before = windowContext.requests.length;
    windowContext.subscriptions.dispatch({event: "link.create", source_model: "message", source_id: 1});
    await settle();
    expect(windowContext.requests.length).toBeGreaterThan(before);
});

test("task 6895: edited work appears beside work created for the request", async () => {
    const element = await mounted(MessageCard, receiptContext([{...EDGE, link_type: "edited"}]), {message: REQUEST});
    expect(element.querySelector("[data-message-links]")?.textContent).toContain("task");
    expect(element.textContent.toLowerCase()).toContain("edited");
});

test("task 6895: a receipt uses returned titles without one task read per chip", async () => {
    const windowContext = receiptContext([EDGE, {...EDGE, id: 2, target_id: 5}, {...EDGE, id: 3, target_id: 6}, {...EDGE, id: 4, target_id: 7}]);
    const element = await mounted(MessageCard, windowContext, {message: REQUEST});
    element.querySelector("[data-message-links-count]").click();
    await settle();
    expect(windowContext.requests.filter((line) => line[0] === "task")).toEqual([]);
    expect(element.textContent).toContain("Cart totals");
});

const linkedItem = (model, id, relations, openRef, title = `${model} ${id}`) => ({endpoint: {model, id, title, exists: true, unavailable: false, open_ref: openRef}, relations, link_ids: [id]});

function planRead(counterparts, requests) {
    return async (line) => {
        requests.push(line);
        return {ok: true, value: {rows: [], counterparts, total: counterparts.length, page: 1, page_size: 10, next_page: null}};
    };
}

test("task 6894: both directions keep all relation labels on one counterpart", async () => {
    const rows = [linkedItem("task", 4, ["mentions", "about"], "tasks:4")];
    const element = await mounted(PlanLinks, context({}), {id: 1, read: planRead(rows, [])});
    expect(element.querySelectorAll("[data-plan-link]")).toHaveLength(1);
    expect(element.textContent).toContain("mentions");
    expect(element.textContent).toContain("about");
});

test("task 6894: missing endpoints stay visible but cannot open", async () => {
    const missing = {endpoint: {model: "task", id: 4, title: "Task 4 unavailable", exists: false, unavailable: true, open_ref: null}, relations: ["about"], link_ids: [1]};
    const element = await mounted(PlanLinks, context({}), {id: 1, read: planRead([missing], [])});
    expect(element.textContent.toLowerCase()).toContain("unavailable");
    expect(element.querySelector("[data-plan-link]")?.disabled).toBe(true);
});

test.each([
    ["task_log", "tasks", 4],
    ["phase", "plans", 1],
])("task 6894: %s opens its parent", async (model, table, id) => {
    const opened = [];
    const rows = [linkedItem(model, 12, ["mentions"], `${table}:${id}`, "Audit totals")];
    const element = await mounted(PlanLinks, context({}), {id: 1, read: planRead(rows, []), onOpen: (value) => opened.push(value)});
    element.querySelector("[data-plan-link]").click();
    await settle();
    expect(opened).toEqual([{table, id}]);
});

test("a migrated comment keeps a native button for its original target", async () => {
    const element = await mounted(MessageCard, receiptContext(), {message: {...REQUEST, type: "comment", commented_row: "task:4"}});
    const button = element.querySelector("[data-message-comment]");
    expect(button.tagName).toBe("BUTTON");
    expect(button.title).toBe("Open task 4");
    expect(button.disabled).toBe(false);
});

async function documentRequests() {
    const requests = [];
    const element = await mounted(DocumentInspector, context({}), {
        table: "docs", id: 4,
        read: async (line) => {
            requests.push(line);
            if (line[1] === "inspect") return {ok: true, value: {id: 4, title: "Cart", abstract: "Totals", body: "Use cents", revision: 1, comments: []}};
            if (line[0] === "link") return {ok: true, value: {rows: [], counterparts: [linkedItem("report", 9, ["about"], "reports:9", "Incoming review")], total: 1}};
            return page([]);
        },
    });
    element.querySelector('[data-document-tab="links"]').click();
    await settle();
    return {requests, element};
}

test("task 6894: the document inspector reads incoming as well as outgoing relations", async () => {
    const {requests, element} = await documentRequests();
    expect(requests.some((line) => line[0] === "link" && line.includes("--row") && line.includes("doc:4") && line.includes("--group-counterparts"))).toBe(true);
    expect(element.querySelector("[data-document-links]").textContent).toContain("Incoming review");
});

test("task 6894: the document inspector bounds every relation read", async () => {
    const {requests} = await documentRequests();
    const links = requests.filter((line) => line[0] === "link");
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((line) => line.includes("--page") && line.includes("--page-size"))).toBe(true);
});

test("task 6894: document comments use their own bounded read", async () => {
    const {requests} = await documentRequests();
    expect(requests.some((line) => line[1] === "comments" && line.includes("--page") && line.includes("--page-size"))).toBe(true);
});

test("task 6894: counterpart pages append once and preserve every label", async () => {
    const requests = [];
    const read = async (line) => {
        requests.push(line);
        const second = line[line.indexOf("--page") + 1] === "2";
        const counterparts = second ? [linkedItem("task", 15, ["about", "edited"], "tasks:15")] : Array.from({length: 10}, (_, at) => linkedItem("task", at + 5, ["about"], `tasks:${at + 5}`));
        return {ok: true, value: {rows: [], counterparts, total: 11, page: second ? 2 : 1, page_size: 10, next_page: second ? null : 2}};
    };
    const element = await mounted(PlanLinks, context({}), {id: 1, read});
    element.querySelector("[data-page-more]").click();
    await settle();
    element.querySelector("[data-link-show-more]").click();
    await settle();
    expect(element.querySelectorAll("[data-plan-link]")).toHaveLength(11);
    expect(element.textContent).toContain("edited");
    expect(requests.at(-1)).toContain("--group-counterparts");
    expect(requests.at(-1)[requests.at(-1).indexOf("--page") + 1]).toBe("2");
});

test("task 7104: many links fold per kind and Show more opens the rest of that kind", async () => {
    const rows = [
        ...Array.from({length: 8}, (_, at) => linkedItem("task", at + 1, ["about"], `tasks:${at + 1}`)),
        ...Array.from({length: 2}, (_, at) => linkedItem("report", at + 1, ["about"], `reports:${at + 1}`)),
    ];
    const element = await mounted(PlanLinks, context({}), {id: 1, read: planRead(rows, [])});
    expect([...element.querySelectorAll("[data-link-kind]")].map((node) => node.textContent.trim())).toEqual(["task 8", "report 2"]);
    expect(element.querySelectorAll('[data-plan-link][data-link-model="task"]')).toHaveLength(3);
    expect(element.querySelectorAll('[data-plan-link][data-link-model="report"]')).toHaveLength(2);
    const fold = element.querySelector("[data-link-show-more]");
    expect(fold.textContent).toBe("Show 5 more");
    expect(element.querySelectorAll("[data-link-show-more]")).toHaveLength(1);
    fold.click();
    await settle();
    expect(element.querySelectorAll('[data-plan-link][data-link-model="task"]')).toHaveLength(8);
    expect(element.querySelector("[data-link-show-more]")).toBeNull();
});

test("task 6894: a relation failure remains visible", async () => {
    const element = await mounted(PlanLinks, context({}), {id: 1, read: async () => ({ok: false, error: "Linked items could not be read"})});
    expect(element.querySelector("[role=alert]")?.textContent).toContain("Linked items could not be read");
});

test("task 6894: transcription links request bounded counterpart pages", async () => {
    const windowContext = context({});
    const requests = [];
    windowContext.read = async (line) => {
        const words = Array.isArray(line) ? line : line.split(" ");
        requests.push(words);
        if (words[0] === "link") return {ok: true, value: {rows: [], counterparts: [linkedItem("doc", 3, ["about"], "docs:3")], total: 1}};
        return page(words[1] === "sources" ? [] : [{id: 4, title: "Meeting", text: "Use cents", created_at: "2026-11-01"}]);
    };
    const element = await mounted(TranscriptionRows, windowContext);
    element.querySelector("[data-transcription='4']").click();
    await settle();
    expect(element.querySelector("[data-transcription-link]").textContent).toContain("doc 3");
    const links = requests.filter((words) => words[0] === "link");
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((words) => words.includes("--page") && words.includes("--page-size") && words.includes("--group-counterparts"))).toBe(true);
});

test("task 6895: receipt relation filters and page bounds are sent to the server", async () => {
    const windowContext = receiptContext();
    await mounted(MessageCard, windowContext, {message: REQUEST});
    const links = windowContext.requests.filter((line) => line.slice(0, 2).join(" ") === "link list");
    expect(links.every((line) => line.includes("--page") && line.includes("--page-size"))).toBe(true);
    expect(links.some((line) => line.includes("--type") && line.includes("about") && line.includes("edited"))).toBe(true);
});
