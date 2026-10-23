import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {flush} from "./flush.js";

const {api} = await import("../src/api/client.js");
const {store} = await import("../src/state/store.js");
const {default: ResourceActions} = await import("../src/resource/ResourceActions.vue");

let app = null;

afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
    store.rows.messages = [];
    vi.restoreAllMocks();
});

function mounted(resource) {
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(ResourceActions, {resource})});
    app.mount(host);
    return host;
}

test("a dockable row's inspector has a Dock button, Undock once the row is docked, and a row that cannot be docked has none", async () => {
    const docked = vi.spyOn(api, "dockRow").mockResolvedValue({});
    const undocked = vi.spyOn(api, "undockRow").mockResolvedValue({});
    store.rows.messages = [];
    let host = mounted({table: "docs", id: 3});
    await flush();
    expect(host.querySelector(".dock-action").textContent.trim()).toBe("Dock");
    host.querySelector(".dock-action").click();
    await flush();
    expect(docked).toHaveBeenCalledWith("docs", 3);
    app.unmount();
    store.rows.messages = [{table: "messages", id: 9, author: "system", text: "The design", data: {kind: "docked", row: "docs:3", docked: true}}];
    host = mounted({table: "docs", id: 3});
    await flush();
    expect(host.querySelector(".dock-action").textContent.trim()).toBe("Undock");
    host.querySelector(".dock-action").click();
    await flush();
    expect(undocked).toHaveBeenCalledWith("docs", 3);
    app.unmount();
    host = mounted({table: "environments", id: 1});
    await flush();
    expect(host.querySelector(".dock-action")).toBeNull();
});
