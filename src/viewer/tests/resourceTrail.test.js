import {afterEach, expect, test} from "vitest";
import MessageCard from "../kit/MessageCard.vue";
import DocumentBody from "../src/resource/document/DocumentBody.vue";
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

test("a migrated comment keeps a native button for its original target", async () => {
    const element = await mounted(MessageCard, receiptContext(), {message: {...REQUEST, type: "comment", commented_row: "task:4"}});
    const button = element.querySelector("[data-message-comment]");
    expect(button.tagName).toBe("BUTTON");
    expect(button.title).toBe("Open task 4");
    expect(button.disabled).toBe(false);
});

async function documentRequests() {
    const requests = [];
    const element = await mounted(DocumentBody, context({}), {
        noun: "doc", id: 4,
        read: async (line) => {
            requests.push(line);
            if (line[1] === "inspect") return {ok: true, value: {id: 4, title: "Cart", abstract: "Totals", body: "Use cents", revision: 1, comments: []}};
            if (line[0] === "link") return {ok: true, value: {rows: [], counterparts: [linkedItem("report", 9, ["about"], "reports:9", "Incoming review")], total: 1}};
            return page([]);
        },
    });
    await settle();
    return {requests, element};
}

test("task 6894: document comments use their own bounded read", async () => {
    const {requests} = await documentRequests();
    expect(requests.some((line) => line[1] === "comments" && line.includes("--page") && line.includes("--page-size"))).toBe(true);
});

test("task 6894: transcription links request bounded counterpart pages", async () => {
    const windowContext = context({}, null, {transcriptions: {line: "transcription list"}, sources: {line: "transcription sources"}, "links.*": {line: "link list --row transcription:{id} --group-counterparts", loading: "requested"}});
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
