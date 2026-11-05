import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import HookRequests from "../../core/modules/developer/web/src/HookRequests.vue";

test("opening a hook request shows its headers and its body", async () => {
    const window = context({});
    const request = {id: 7, received_at: "2026-11-02T18:00:00", day: "2026-11-02", day_start: true, time: "18:00:00.000", event: "stop", tool: "", duration_ms: 12, outcome: "allowed", program: "claude", headers: {"X-Journal-Hook-Id": "firing-1"}, body: {event: "stop"}};
    window.read = async () => ({ok: true, value: {rows: [request]}});
    const element = await mounted(HookRequests, window);
    await settle();
    expect(element.querySelector("[data-hook-request='7']").textContent).toContain("stop");
    expect([...element.querySelectorAll("[data-hook-column]")].map((column) => column.textContent)).toEqual(["Event", "Tool", "Parts", "Time", "Duration"]);
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
});

test("slow requests are amber and refused requests stay red even when slow", async () => {
    const window = context({});
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
    const window = context({});
    window.read = async () => ({ok: true, value: {rows: []}});
    const element = await mounted(HookRequests, window);
    await settle();
    expect(element.textContent).toContain("Record agent calls");
});
