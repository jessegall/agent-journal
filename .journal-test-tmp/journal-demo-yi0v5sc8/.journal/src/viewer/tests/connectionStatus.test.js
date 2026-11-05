import {afterEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import InformationBar from "../src/shell/InformationBar.vue";
import {transport} from "../src/api/transport.js";

let app;
afterEach(() => {
    app.unmount();
    vi.restoreAllMocks();
    vi.useRealTimers();
});

test("the information bar shows the server connection and changes after its next check", async () => {
    vi.useFakeTimers();
    const read = vi.spyOn(transport, "serverState")
        .mockResolvedValueOnce({ok: true, json: async () => ({connection: "offline"})})
        .mockResolvedValueOnce({ok: true, json: async () => ({connection: "online"})})
        .mockRejectedValueOnce(new TypeError("Server unavailable"));
    const element = document.createElement("div");
    app = createApp(() => h(InformationBar));
    app.mount(element);
    await vi.advanceTimersByTimeAsync(0);
    expect(element.querySelector("[data-connection-status]").textContent).toBe("Connection: Offline");
    await vi.advanceTimersByTimeAsync(10000);
    expect(element.querySelector("[data-connection-status]").textContent).toBe("Connection: Online");
    await vi.advanceTimersByTimeAsync(10000);
    expect(element.querySelector("[data-connection-status]").textContent).toBe("Connection: Checking");
    app.unmount();
    await vi.advanceTimersByTimeAsync(20000);
    expect(read).toHaveBeenCalledTimes(3);
});
