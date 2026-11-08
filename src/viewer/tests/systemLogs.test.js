import {expect, test, vi} from "vitest";
import {READ_RATES} from "../src/composables/readRates.js";
import {mounted, settle} from "./support/windowContext.js";
import {systemLogsWindowContext as context} from "./support/systemLogsWindowContext.js";
import SystemLogs from "../../core/modules/developer/web/src/SystemLogs.vue";

async function pick(element, field, key) {
    if (!element.isConnected) document.body.append(element);
    element.querySelector(`[${field}] [data-drop-head]`).click();
    await settle();
    document.querySelector(`[data-drop-item="${key}"]`).click();
    await settle();
}

const listing = (text = "server started") => ({ok: true, value: {rows: [{id: "server.log:1", recorded_at: "2026-11-06T12:00:00+00:00", source: "server", level: "info", text}], total: 75, size: 50}});

test("system logs show time, source, level and escaped messages through one read", async () => {
    const window = context({"developer system-logs": listing("<script>sample</script>")});
    const element = await mounted(SystemLogs, window);
    expect(window.reads).toEqual(["developer system-logs --page 1"]);
    expect(element.querySelector("time").dateTime).toBe("2026-11-06T12:00:00+00:00");
    expect(element.querySelector("[data-log-line]").textContent).toContain("serverinfo<script>sample</script>");
    expect(element.querySelector("script")).toBeNull();
    expect(element.textContent).toContain("Page 1 of 2");
});

test("system log paging and filters are read on the server and filters return to page one", async () => {
    const window = context({"developer system-logs": listing()});
    const element = await mounted(SystemLogs, window);
    element.querySelector("[data-log-next]").click();
    await settle();
    expect(window.reads.at(-1)).toContain("--page 2");
    await pick(element, "data-log-source", "journal");
    expect(window.reads.at(-1)).toBe("developer system-logs --page 1 --source journal");
    await pick(element, "data-log-level", "warning");
    expect(window.reads.at(-1)).toContain("--source journal --level warning");
});

test("pause freezes log lines and filters until resume, and reports read failures", async () => {
    const window = context({"developer system-logs": listing()});
    const element = await mounted(SystemLogs, window);
    const pause = element.querySelector("[data-log-pause]");
    pause.click();
    await settle();
    await pick(element, "data-log-source", "journal");
    expect(window.reads).toHaveLength(1);
    expect(pause.textContent).toBe("Resume");
    expect(element.querySelector("[data-log-next]").disabled).toBe(true);
    window.read = async () => ({ok: false, error: "could not read logs"});
    pause.click();
    await settle();
    expect(element.querySelector('[role="alert"]').textContent).toBe("could not read logs");
    expect(element.querySelector("[data-log-line]").textContent).toContain("server started");
});

test("the page reads again at its chosen rate", async () => {
    const delays = [];
    const real = globalThis.setTimeout;
    const spy = vi.spyOn(globalThis, "setTimeout").mockImplementation((callback, delay, ...rest) => {
        delays.push(delay);
        return real(callback, delay, ...rest);
    });
    await mounted(SystemLogs, context({"developer system-logs": listing()}));
    expect(delays).toContain(READ_RATES.systemLogs);
    spy.mockRestore();
});

test("the buttons and the dropdowns of the system logs are the kit's", async () => {
    const element = await mounted(SystemLogs, context({"developer system-logs": listing()}));
    for (const marker of ["data-log-pause", "data-log-previous", "data-log-next"]) expect(element.querySelector(`button[${marker}]`).classList.contains("btn")).toBe(true);
    for (const marker of ["data-log-source", "data-log-level"]) expect(element.querySelector(`[${marker}] [data-drop-head]`)).not.toBeNull();
    expect(element.querySelector("select")).toBeNull();
});
