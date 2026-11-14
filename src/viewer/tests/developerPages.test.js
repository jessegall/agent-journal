import {afterEach, expect, test} from "vitest";
import {sidebarSections} from "../src/domain/sidebarNav.js";
import {context, mounted, settle} from "./support/windowContext.js";
import {requestLogWindowContext} from "./support/requestLogWindowContext.js";
import {systemLogsWindowContext} from "./support/systemLogsWindowContext.js";
import HookNumbers from "../../core/modules/developer/web/src/HookNumbers.vue";
import HookRequests from "../../core/modules/developer/web/src/HookRequests.vue";
import SystemLogs from "../../core/modules/developer/web/src/SystemLogs.vue";

afterEach(() => (document.body.innerHTML = ""));

const rowsOf = (element) => [...element.querySelectorAll(".table-row:not(.head):not(.empty)")];
const headOf = (element) => [...element.querySelectorAll(".table-row.head .cell")].map((cell) => cell.textContent);
const cellsOf = (row) => [...row.querySelectorAll(".cell")].map((cell) => cell.textContent);

test("test_numbers_on_table: the numbers are rows of the table layout with the same four columns", async () => {
    const window = context({}, null, {numbers: {line: "developer numbers", switches: ["costliest"]}});
    window.read = async () => ({ok: true, value: {rows: [{id: "stop", hook: "stop", count: 2, most_points: 30, average_points: 5}]}});
    const element = await mounted(HookNumbers, window);
    await settle();
    expect(element.querySelector("[data-table-layout]")).not.toBeNull();
    expect(headOf(element)).toEqual(["Hook, reader or route", "Count", "Average points", "Most points"]);
    expect(cellsOf(rowsOf(element)[0])).toEqual(["stop", "2", "5", "30"]);
    expect(element.querySelector("[data-numbers-sort]")).not.toBeNull();
});

test("test_system_logs_on_table: the log lines are rows of the table layout, with warnings and errors in a tone, and paging stays on the server", async () => {
    const lines = [
        {id: "a", recorded_at: "2026-11-06T12:00:00+00:00", source: "server", level: "info", text: "server started"},
        {id: "b", recorded_at: "2026-11-06T12:01:00+00:00", source: "journal", level: "error", text: "it broke"},
    ];
    const window = systemLogsWindowContext({"developer system-logs": {ok: true, value: {rows: lines, total: 75, size: 50}}});
    const element = await mounted(SystemLogs, window);
    expect(element.querySelector("[data-table-layout]")).not.toBeNull();
    expect(headOf(element)).toEqual(["Time", "Source", "Level", "Message"]);
    const [first, second] = rowsOf(element);
    expect(cellsOf(first).slice(1)).toEqual(["Server", "Info", "server started"]);
    expect(second.classList.contains("danger")).toBe(true);
    expect(first.classList.contains("danger")).toBe(false);
    expect(element.textContent).toContain("Page 1 of 2");
});

test("test_request_log_on_table: the requests are rows of the table layout, the chosen row shows its details beside it, and a refused or slow row has its tone", async () => {
    const window = requestLogWindowContext();
    const rows = [
        {id: 1, event: "stop", tool: "", time: "12:29:53.913", sender: "Main agent", queued_ms: 1, duration_ms: 800, outcome: "allowed", headers: {}, body: {}},
        {id: 2, event: "pre_tool_use", tool: "Bash", part_count: 3, time: "12:29:52.012", sender: "Main agent", queued_ms: 2, duration_ms: 20, outcome: "refused", headers: {}, body: {}},
    ];
    window.read = async () => ({ok: true, value: {rows}});
    const element = await mounted(HookRequests, window);
    await settle();
    expect(headOf(element)).toEqual(["Event", "Tool", "Parts", "Time", "Sender", "Queued", "Duration"]);
    expect(cellsOf(element.querySelector("[data-table-row='2']"))).toEqual(["pre_tool_use", "Bash", "3", "12:29:52.012", "Main agent", "2 ms", "20 ms"]);
    expect(element.querySelector("[data-table-row='1']").classList.contains("warn")).toBe(true);
    expect(element.querySelector("[data-table-row='2']").classList.contains("danger")).toBe(true);
    element.querySelector("[data-table-row='2']").click();
    await settle();
    expect(element.querySelector("[data-hook-request-detail] h2").textContent).toBe("pre_tool_use");
    expect(element.querySelector("[data-table-row='2']").classList.contains("active")).toBe(true);
});

test("test_hidden_without_developer_pages: the sidebar has a Developer group only when the journal offers developer pages", () => {
    const offered = [{name: "developer.numbers", title: "Numbers", group: "developer"}, {name: "skills.skills", title: "Skills", group: "project"}];
    expect(sidebarSections(offered).find((section) => section.key === "developer").windows.map((window) => window.name)).toEqual(["developer.numbers"]);
    expect(sidebarSections(offered.slice(1)).map((section) => section.key)).not.toContain("developer");
});
