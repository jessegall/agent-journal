import {beforeEach, describe, expect, test} from "vitest";
import {knowPages, opening, peek, peekThere, route, showSession, swap, unpeek} from "../src/route.js";
import {choose} from "../src/state/environment.js";

knowPages((name) => ["todo", "file", "report", "search", "plugins", "message", "mcp"].includes(name));
choose("main");

const at = async (hash) => {
    location.hash = hash;
    await new Promise((done) => setTimeout(done));
};

const settled = async () => {
    await new Promise((done) => setTimeout(done));
    return location.hash;
};

describe("addresses the viewer reads", () => {
    test.each([
        ["#/todo/12", {env: "main", page: "todo", n: 12, stack: []}],
        ["#/file?q=a%2Fb.py&line=4", {env: "main", page: "file", q: "a/b.py", line: 4}],
        ["#/report?sub=updates", {page: "report", sub: "updates"}],
        ["#/todo?open=todo:3,message:7:2@other", {stack: [{type: "todo", n: 3, comment: 0, env: ""}, {type: "message", n: 7, comment: 2, env: "other"}]}],
    ])("%s", async (hash, wanted) => {
        await at(hash);
        expect(route.value).toMatchObject(wanted);
    });
});

describe("an address from before", () => {
    test("one naming an environment opens on it and is rewritten without it", async () => {
        await at("#/spike/todo/12");
        expect(await settled()).toBe("#/todo/12");
        expect(route.value).toMatchObject({env: "spike", page: "todo", n: 12});
        choose("main");
    });

    test("a renamed page lands on its new name", async () => {
        await at("#/integrations");
        expect(await settled()).toBe("#/mcp");
    });
});

describe("addresses the viewer builds", () => {
    beforeEach(() => at("#/todo"));

    test("a sub page opens with an empty stack", async () => {
        opening([], "log");
        expect(await settled()).toBe("#/todo?sub=log");
        showSession("");
        expect(await settled()).toBe("#/todo");
    });

    test("a sub page rides after the open stack", async () => {
        peek("todo", 5, 0, "log");
        expect(await settled()).toBe("#/todo?open=todo:5&sub=log");
        peek("todo", 6);
        expect(await settled()).toBe("#/todo?open=todo:5,todo:6");
    });

    test("swap and unpeek keep the stack", async () => {
        swap("todo", 9);
        expect(await settled()).toBe("#/todo?open=todo:9");
        unpeek();
        expect(await settled()).toBe("#/todo");
    });

    test("opening a search result keeps the search", async () => {
        at("#/search?q=roses");
        await settled();
        peek("message", 12);
        expect(await settled()).toBe("#/search?q=roses&open=message:12");
        expect(route.value.q).toBe("roses");
    });

    test("a plugin opens on the Plugins page, not in a side panel", async () => {
        peek("plugin", 3);
        expect(await settled()).toBe("#/plugins?plugin=3");
    });

    test("peeking at another environment names it", async () => {
        peekThere("other", "todo", 4);
        expect(await settled()).toBe("#/todo?open=todo:4@other");
    });
});
