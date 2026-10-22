import {createApp, h, nextTick} from "vue";
import {expect, test, vi} from "vitest";
import {threadTurns} from "../src/domain/thread.js";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

const watch = {
    table: "messages",
    id: 7,
    created_at: new Date(1e4).toISOString(),
    creator: "system",
    author: "system",
    text: "Watching output 12: pytest -q",
    files: [],
    comments_on: [],
    idempotency: "",
    data: {
        kind: "card",
        icon: "terminal",
        output: 12,
        figure: "Tests 40%",
        count: "40%",
        fraction: 0.4,
        ending: "",
        detail: "FAILED test_b",
        lines: ["FAILED test_b", "FAILED test_c"],
        key: "watch:12",
        shows: "commands",
    },
};

function mounted(component, props, act) {
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(component, props)});
    app.provide("scope", {env: "", api: {act}, rows: () => [], loaded: () => true, holding: () => {}, earlier: () => {}});
    app.directive("tip", {});
    app.mount(host);
    return {host, done: () => (app.unmount(), host.remove())};
}

test("a watched output's card carries its count and its bar inside it while it runs, none once it ended, and docks on its button", async () => {
    const {default: Turn} = await import("../src/chat/Turn.vue");
    const act = vi.fn();
    const {host, done} = mounted(Turn, {turn: threadTurns([watch], []).turns[0]}, act);
    await nextTick();
    expect(host.querySelector(".mark .figure").textContent).toBe("40%");
    expect(host.querySelector(".mark .progress").style.width).toBe("40%");
    host.querySelector(".mark-dock").click();
    expect(act).toHaveBeenCalledWith("messages", 7, "dock");
    done();
    const finished = mounted(Turn, {turn: threadTurns([{...watch, data: {...watch.data, count: "", ending: "finished"}}], []).turns[0]}, act);
    await nextTick();
    expect(finished.host.querySelector(".mark .progress")).toBeNull();
    expect(finished.host.querySelector(".mark-dock")).toBeNull();
    finished.done();
});

test("a docked watch shows its last lines and its bar, and only the user takes it down", async () => {
    const {default: WatchDock} = await import("../src/chat/WatchDock.vue");
    const act = vi.fn();
    const ended = {...watch, data: {...watch.data, docked: true, ending: "finished"}};
    const {host, done} = mounted(WatchDock, {message: ended}, act);
    await nextTick();
    expect([...host.querySelectorAll(".watch-dock-lines li")].map((li) => li.textContent)).toEqual(["FAILED test_b", "FAILED test_c"]);
    expect(host.querySelector(".watch-dock-ending").textContent).toBe("finished");
    host.querySelector('[aria-label^="Take the watched output down"]').click();
    expect(act).toHaveBeenCalledWith("messages", 7, "undock");
    expect(ended.data.docked).toBe(false);
    done();
});
