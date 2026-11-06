import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {BrowserEvents} from "../src/windows/browserEvents.js";

// the tabs of a browser, in one page: a channel that tells every other tab, a lock held by one tab at a time, and the streams that were opened
function browser() {
    const channels = new Set();
    const holders = [];
    const streams = [];
    vi.stubGlobal("BroadcastChannel", class {
        constructor() {
            channels.add(this);
        }

        postMessage(data) {
            for (const channel of [...channels]) if (channel !== this) channel.onmessage?.({data: structuredClone(data)});
        }
    });
    vi.stubGlobal("EventSource", class {
        constructor(url) {
            this.url = url;
            this.listeners = {};
            streams.push(this);
        }

        addEventListener(name, heard) {
            this.listeners[name] = heard;
        }

        close() {
            this.closed = true;
        }

        cursor(id) {
            this.listeners.cursor({data: JSON.stringify({id})});
        }

        event(fields) {
            this.onmessage({data: JSON.stringify(fields)});
        }
    });
    const grant = () => holders[0]?.();
    const locks = {request: (_, holder) => {
        holders.push(holder);
        if (holders.length === 1) grant();
        return new Promise(() => {});
    }};
    vi.stubGlobal("navigator", {locks});
    return {
        streams,
        open: () => streams.filter((stream) => !stream.closed),
        leave: (tab) => {
            channels.delete(tab.channel);
            tab.close();
            holders.shift();
            grant();
        },
    };
}

const follower = (environment, patterns = ["message.*"]) => {
    const heard = [];
    return {environment, patterns, heard: (event) => heard.push(event.id), events: heard};
};

let world;
beforeEach(() => (world = browser()));
afterEach(() => vi.unstubAllGlobals());

test("many tabs hold one stream, for what they all follow, and each hears its own events", () => {
    const [first, second] = [new BrowserEvents().start(), new BrowserEvents().start()];
    const main = follower("main");
    const other = follower("other", ["task.*"]);
    first.follow(main);
    second.follow(other);
    expect(world.open()).toHaveLength(1);
    world.open()[0].cursor(10);
    const stream = world.open()[0];
    expect(world.streams).toHaveLength(2);
    expect(stream.url).toContain("environment=main&environment=other");
    expect(stream.url).toContain("follow=message.*");
    expect(stream.url).toContain("follow=task.*");
    stream.event({id: 11, event: "message.create", environment: "main"});
    stream.event({id: 12, event: "task.update", environment: "other"});
    stream.event({id: 13, event: "task.update", environment: "main"});
    stream.event({id: 14, event: "message.create", environment: null});
    expect(main.events).toEqual([11, 14]);
    expect(other.events).toEqual([12]);
});

test("when the tab with the stream goes, another opens it from the last event and hears nothing twice", () => {
    const [first, second] = [new BrowserEvents().start(), new BrowserEvents().start()];
    const kept = follower("main");
    first.follow(follower("main"));
    second.follow(kept);
    world.open()[0].cursor(10);
    world.open()[0].event({id: 11, event: "message.create", environment: "main"});
    world.leave(first);
    expect(world.open()).toHaveLength(1);
    const stream = world.open()[0];
    expect(stream.url).toContain("cursor=11");
    stream.event({id: 11, event: "message.create", environment: "main"});
    stream.event({id: 12, event: "message.create", environment: "main"});
    expect(kept.events).toEqual([11, 12]);
});

test("a tab that stops following leaves the stream to the others, and the last one closes it", () => {
    const [first, second] = [new BrowserEvents().start(), new BrowserEvents().start()];
    const stopFirst = first.follow(follower("main"));
    const stopSecond = second.follow(follower("main", ["task.*"]));
    world.open()[0].cursor(10);
    stopSecond();
    world.open()[0].cursor(10);
    expect(world.open()[0].url).not.toContain("task");
    stopFirst();
    expect(world.open()).toEqual([]);
});
