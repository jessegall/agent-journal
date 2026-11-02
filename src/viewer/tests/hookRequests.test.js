import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import HookRequests from "../../core/modules/developer/web/src/HookRequests.vue";

test("opening a hook request shows its headers and its body", async () => {
    const window = context({});
    const request = {id: 7, received_at: "2026-11-02T18:00:00", program: "claude", headers: {"X-Journal-Hook-Id": "firing-1"}, body: {event: "stop"}};
    window.read = async () => ({ok: true, value: {rows: [request]}});
    const element = await mounted(HookRequests, window);
    await settle();
    expect(element.querySelector("[data-hook-request='7']").textContent).toContain("stop");
    expect(element.querySelector("[data-hook-request-detail]")).toBeNull();
    element.querySelector("[data-hook-request='7']").click();
    await settle();
    expect(element.querySelector("[data-hook-request-headers]").textContent).toContain("firing-1");
    expect(element.querySelector("[data-hook-request-body]").textContent).toContain('"event": "stop"');
});

test("with nothing recorded it says which option turns the log on", async () => {
    const window = context({});
    window.read = async () => ({ok: true, value: {rows: []}});
    const element = await mounted(HookRequests, window);
    await settle();
    expect(element.textContent).toContain("Record agent calls");
});
