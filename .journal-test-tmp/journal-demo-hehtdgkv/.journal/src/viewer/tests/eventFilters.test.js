import {afterEach, expect, test, vi} from "vitest";
import {computed, nextTick, ref} from "vue";
import {followEvents} from "../src/windows/windowCatalogue.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";

afterEach(() => vi.unstubAllGlobals());

function streams() {
    const opened = [];
    vi.stubGlobal("EventSource", class {
        constructor(url) {
            this.url = new URL(url, "http://journal.test");
            this.closed = false;
            this.handlers = {};
            opened.push(this);
        }
        addEventListener(name, heard) { this.handlers[name] = heard; }
        close() { this.closed = true; }
    });
    return opened;
}

test("the stream asks only for the events its windows follow", async () => {
    const opened = streams();
    const subscriptions = new WindowSubscriptions();
    const stop = followEvents("main", () => {}, computed(() => subscriptions.patterns));
    const endTasks = subscriptions.follow("tasks", ["task.*"], () => {});
    await nextTick();
    opened[0].handlers.cursor({data: JSON.stringify({id: 10})});
    await nextTick();
    expect(opened.at(-1).url.searchParams.getAll("follow")).toEqual(["task.*"]);
    expect(opened.at(-1).url.searchParams.get("cursor")).toBe("10");
    const endCalls = subscriptions.follow("calls", ["hook_call.*"], () => {});
    await nextTick();
    expect(opened.at(-1).url.searchParams.getAll("follow")).toEqual(["hook_call.*", "task.*"]);
    endCalls();
    await nextTick();
    expect(opened.at(-1).url.searchParams.getAll("follow")).toEqual(["task.*"]);
    endTasks();
    stop();
    expect(opened.every((source) => source.closed)).toBe(true);
});

test("changing the patterns resumes after the last delivered event", async () => {
    const opened = streams();
    const patterns = ref(["task.*"]);
    const heard = [];
    const stop = followEvents("main", (event) => heard.push(event.event), patterns);
    opened[0].handlers.cursor({data: JSON.stringify({id: 10})});
    opened[0].onmessage({data: JSON.stringify({id: 12, event: "task.create"}), lastEventId: "12"});
    patterns.value = ["message.*"];
    await nextTick();
    expect(opened[0].closed).toBe(true);
    expect(opened[1].url.searchParams.get("cursor")).toBe("12");
    expect(heard).toEqual(["task.create"]);
    stop();
});

test("matching patterns are shared and remain until the last window stops", () => {
    const subscriptions = new WindowSubscriptions();
    subscriptions.follow("tasks", ["task.*"], () => {});
    const end = subscriptions.follow("other-tasks", ["task.*", "message.*"], () => {});
    expect(subscriptions.patterns).toEqual(["message.*", "task.*"]);
    subscriptions.stopAll("tasks");
    expect(subscriptions.patterns).toEqual(["message.*", "task.*"]);
    end();
    expect(subscriptions.patterns).toEqual([]);
});
