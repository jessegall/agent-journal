import {afterEach, expect, test} from "vitest";
import MessageCard from "../kit/MessageCard.vue";
import PlanLinks from "../src/resource/PlanLinks.vue";
import DocumentInspector from "../src/resource/document/DocumentInspector.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";

const REQUEST = {id: 1, type: "user", text: "Fix the cart totals", created_at: "2026-11-01T10:00:00Z"};
const unbuilt = import.meta.env.MODE === "trail-red" ? test : test.fails;

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
            return page(words[0] === "link" ? rows : []);
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

unbuilt("task 6895: another message's link event leaves this receipt alone", async () => {
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

unbuilt("task 6895: edited work appears beside work created for the request", async () => {
    const element = await mounted(MessageCard, receiptContext([{...EDGE, link_type: "edited"}]), {message: REQUEST});
    expect(element.querySelector("[data-message-links]")?.textContent).toContain("task");
    expect(element.textContent.toLowerCase()).toContain("edited");
});

unbuilt("task 6895: a receipt uses returned titles without one task read per chip", async () => {
    const windowContext = receiptContext([EDGE, {...EDGE, id: 2, target_id: 5}, {...EDGE, id: 3, target_id: 6}, {...EDGE, id: 4, target_id: 7}]);
    const element = await mounted(MessageCard, windowContext, {message: REQUEST});
    element.querySelector("[data-message-links-count]").click();
    await settle();
    expect(windowContext.requests.filter((line) => line[0] === "task")).toEqual([]);
    expect(element.textContent).toContain("Cart totals");
});

function planRead(rows, requests) {
    return async (line) => {
        requests.push(line);
        const flag = line.includes("--source") ? "source" : "target";
        return page(rows.filter((row) => row[`${flag}_model`] === "plan"));
    };
}

unbuilt("task 6894: both directions keep all relation labels on one counterpart", async () => {
    const rows = [
        {...EDGE, source_model: "plan", source_id: 1, link_type: "mentions"},
        {...EDGE, id: 2, source_model: "task", source_id: 4, target_model: "plan", target_id: 1, link_type: "about"},
    ];
    const element = await mounted(PlanLinks, context({}), {id: 1, read: planRead(rows, [])});
    expect(element.querySelectorAll("[data-plan-link]")).toHaveLength(1);
    expect(element.textContent).toContain("mentions");
    expect(element.textContent).toContain("about");
});

unbuilt("task 6894: missing endpoints stay visible but cannot open", async () => {
    const element = await mounted(PlanLinks, context({}), {id: 1, read: planRead([{...EDGE, source_model: "plan", source_id: 1, target_exists: false}], [])});
    expect(element.textContent.toLowerCase()).toContain("unavailable");
    expect(element.querySelector("[data-plan-link]")?.disabled).toBe(true);
});

unbuilt.each([
    ["task_log", "tasks", 4],
    ["phase", "plans", 1],
])("task 6894: %s opens its parent", async (model, table, id) => {
    const opened = [];
    const rows = [{...EDGE, source_model: "plan", source_id: 1, target_model: model, target_id: 12, target_open_ref: `${table}:${id}`}];
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
    await mounted(DocumentInspector, context({}), {
        table: "docs", id: 4,
        read: async (line) => {
            requests.push(line);
            if (line[1] === "inspect") return {ok: true, value: {id: 4, title: "Cart", abstract: "Totals", body: "Use cents", revision: 1, comments: []}};
            return page([]);
        },
    });
    return requests;
}

unbuilt("task 6894: the document inspector reads incoming as well as outgoing relations", async () => {
    const requests = await documentRequests();
    expect(requests.some((line) => line[0] === "link" && line.includes("--target") && line.includes("doc:4"))).toBe(true);
});

unbuilt("task 6894: the document inspector bounds every relation read", async () => {
    const requests = await documentRequests();
    const links = requests.filter((line) => line[0] === "link");
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((line) => line.includes("--page") && line.includes("--page-size"))).toBe(true);
});

unbuilt("task 6894: document comments use their own bounded read", async () => {
    const requests = await documentRequests();
    expect(requests.some((line) => line[1] === "comments" && line.includes("--page") && line.includes("--page-size"))).toBe(true);
});

unbuilt("task 6895: receipt relation filters and page bounds are sent to the server", async () => {
    const windowContext = receiptContext();
    await mounted(MessageCard, windowContext, {message: REQUEST});
    const links = windowContext.requests.filter((line) => line.slice(0, 2).join(" ") === "link list");
    expect(links.every((line) => line.includes("--page") && line.includes("--page-size"))).toBe(true);
    expect(links.some((line) => line.includes("--type") && line.includes("about") && line.includes("edited"))).toBe(true);
});
