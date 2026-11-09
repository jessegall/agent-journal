import {expect, test, vi} from "vitest";
import {mounted, settle} from "./support/windowContext.js";
import {requestLogWindowContext} from "./support/requestLogWindowContext.js";
import HookRequests from "../../core/modules/developer/web/src/HookRequests.vue";

test("opening a hook request shows its headers and its body", async () => {
    const window = requestLogWindowContext();
    const request = {id: 7, received_at: "2026-11-02T18:00:00", day: "2026-11-02", day_start: true, time: "18:00:00.000", event: "stop", tool: "", duration_ms: 12, outcome: "allowed", program: "claude", headers: {"X-Journal-Hook-Id": "firing-1"}, body: {event: "stop"}};
    window.read = async () => ({ok: true, value: {rows: [request]}});
    const element = await mounted(HookRequests, window);
    await settle();
    expect(element.querySelector("[data-hook-request='7']").textContent).toContain("stop");
    expect([...element.querySelectorAll("[data-hook-column]")].map((column) => column.textContent)).toEqual(["Event", "Tool", "Parts", "Time", "Sender", "Queued", "Duration"]);
    expect(element.querySelector("[data-hook-request='7'] [data-hook-parts]").textContent).toBe("");
    expect(element.querySelector("[data-hook-day]").textContent).toContain("2026-11-02");
    expect(element.querySelector("[data-hook-request='7']").textContent).toContain("18:00:00.000");
    expect(element.querySelector("[data-hook-request='7']").textContent).toContain("12 ms");
    expect(element.querySelector("[data-hook-request-divider]")).not.toBeNull();
    expect(element.querySelector("[data-hook-request-detail]")).toBeNull();
    element.querySelector("[data-hook-request='7']").click();
    await settle();
    expect(element.querySelector("[data-hook-request-headers]").textContent).toContain("firing-1");
    const body = element.querySelector("[data-hook-request-body]");
    expect(body.textContent).toContain('"event": "stop"');
    expect(body.querySelector(".tok-property").textContent).toBe('"event"');
    expect(body.querySelector(".tok-string").textContent).toBe('"stop"');
    expect(element.querySelector("[data-hook-request-detail] .detail-head span").textContent).toContain(" · Allowed · ");
});

test("request filters are sent to the server and remembered", async () => {
    localStorage.removeItem("journal.hook-requests.filters");
    const window = requestLogWindowContext();
    window.read = async (line) => { window.reads.push(line); return {ok: true, value: {rows: []}}; };
    const element = await mounted(HookRequests, window);
    document.body.append(element);
    element.querySelector("[data-filter-open]").click();
    await settle();
    document.querySelector('[data-filter-category="viewer"]').click();
    document.querySelector('[data-filter-family="process bookkeeping"]').click();
    await settle();
    expect(window.reads.some((line) => line.includes('--categories ["viewer"]') && line.includes('--families ["process bookkeeping"]'))).toBe(true);
    expect(element.querySelector("[data-filter-count]").textContent).toContain("2");
    expect(JSON.parse(localStorage.getItem("journal.hook-requests.filters")).category).toEqual(["viewer"]);
    document.querySelector("[data-filter-clear]").click();
    await settle();
    expect(element.querySelector("[data-filter-count]")).toBeNull();
    localStorage.removeItem("journal.hook-requests.filters");
});

test("the request queue is read only after its inspector opens", async () => {
    const window = requestLogWindowContext({
        "developer hook-requests": {ok: true, value: {rows: []}},
        "developer request-queue": {ok: true, value: {running: [], waiting: [], hook_limit: 2, main_hook_seconds: 1, agent_hook_seconds: 1, viewer_wait_seconds: 1}},
    });
    const requests = vi.spyOn(window, "readKeys");
    const element = await mounted(HookRequests, window);
    expect(requests).toHaveBeenCalledTimes(1);
    expect(window.reads.some((line) => line.startsWith("developer request-queue"))).toBe(false);
    element.querySelector("[data-request-queue-open]").click();
    await settle();
    expect(requests.mock.calls.at(-1)[0].only).toEqual(["queue"]);
    expect(element.querySelector("[data-request-queue-empty]").textContent).toBe("No running requests.");
});

test("slow requests are amber and refused requests stay red even when slow", async () => {
    const window = requestLogWindowContext();
    window.read = async () => ({ok: true, value: {rows: [
        {id: 1, event: "stop", tool: "", time: "12:29:53.913", day: "2026-11-03", day_start: true, duration_ms: 800, outcome: "allowed"},
        {id: 2, event: "stop", tool: "", time: "12:29:52.012", day: "2026-11-03", day_start: false, duration_ms: 900, outcome: "refused"},
    ]}});
    const element = await mounted(HookRequests, window);
    await settle();
    expect(element.querySelector("[data-hook-request='1']").classList.contains("slow")).toBe(true);
    expect(element.querySelector("[data-hook-request='2']").classList.contains("refused")).toBe(true);
    expect(element.querySelector("[data-hook-request='2']").classList.contains("slow")).toBe(false);
    expect(element.querySelectorAll("[data-hook-day]")).toHaveLength(1);
});

test("with nothing recorded it says which option turns the log on", async () => {
    const window = requestLogWindowContext();
    window.read = async () => ({ok: true, value: {rows: []}});
    const element = await mounted(HookRequests, window);
    await settle();
    expect(element.textContent).toContain("Record agent calls");
});

test("pausing keeps the list and resuming reads again", async () => {
    const window = requestLogWindowContext();
    let reads = 0;
    window.read = async () => ({ok: true, value: {rows: [{id: ++reads, event: "stop", sender: "Main agent", duration_ms: 1}]}});
    const element = await mounted(HookRequests, window);
    await settle();
    const button = element.querySelector("[data-feed-pause]");
    button.click();
    await settle();
    expect(button.textContent).toBe("Resume");
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(element.querySelector('[data-hook-request="1"]')).not.toBeNull();
    button.click();
    await settle();
    expect(element.querySelector('[data-hook-request="2"]')).not.toBeNull();
});

test("a read answered after pausing leaves the shown requests in place", async () => {
    const window = requestLogWindowContext();
    let reads = 0;
    let finish;
    const answer = (id) => ({ok: true, value: {rows: [{id, event: "stop", sender: "Main agent", duration_ms: 1}]}});
    window.read = async () => ++reads === 2 ? new Promise((resolve) => (finish = resolve)) : answer(reads);
    const element = await mounted(HookRequests, window);
    const loading = window.reload("requests");
    await settle();
    const button = element.querySelector("[data-feed-pause]");
    button.click();
    finish(answer(2));
    await loading;
    await settle();
    expect(element.querySelector('[data-hook-request="1"]')).not.toBeNull();
    expect(element.querySelector('[data-hook-request="2"]')).toBeNull();
    button.click();
    await settle();
    expect(element.querySelector('[data-hook-request="3"]')).not.toBeNull();
});

test("an agent sender links to its card without opening request details", async () => {
    const window = requestLogWindowContext();
    window.read = async () => ({ok: true, value: {rows: [{id: 1, agent_id: 42, sender: "Worker 42", event: "stop", duration_ms: 1}]}});
    const element = await mounted(HookRequests, window);
    await settle();
    const sender = element.querySelector('[data-peek="agents:42"]');
    expect(sender).not.toBeNull();
    sender.click();
    expect(element.querySelector("[data-hook-request-detail]")).toBeNull();
});

test("the buttons of the request log are the kit's", async () => {
    const element = await mounted(HookRequests, requestLogWindowContext());
    for (const marker of ["data-filter-open", "data-feed-pause", "data-request-queue-open"]) expect(element.querySelector(`button[${marker}]`).classList.contains("btn")).toBe(true);
});
