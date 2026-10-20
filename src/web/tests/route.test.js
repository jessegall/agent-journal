import {beforeEach, describe, expect, test} from "vitest";
import {knowPages, opening, peek, peekThere, route, showSession, swap, unpeek} from "../src/route.js";
import {choose} from "../src/state/environment.js";

knowPages((name) => ["tasks", "file", "reports", "search", "plugins", "messages", "mcp"].includes(name));
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
        ["#/tasks/12", {env: "main", page: "tasks", n: 12, stack: []}],
        ["#/file?q=a%2Fb.py&line=4", {env: "main", page: "file", q: "a/b.py", line: 4}],
        ["#/reports?sub=closed", {page: "reports", sub: "closed"}],
        ["#/tasks?open=tasks:3,messages:7:2@other", {stack: [{table: "tasks", id: 3, comment: 0, env: ""}, {table: "messages", id: 7, comment: 2, env: "other"}]}],
    ])("%s", async (hash, wanted) => {
        await at(hash);
        expect(route.value).toMatchObject(wanted);
    });
});

describe("an address from before", () => {
    test("one naming an environment opens on it and is rewritten without it", async () => {
        await at("#/spike/tasks/12");
        expect(await settled()).toBe("#/tasks/12");
        expect(route.value).toMatchObject({env: "spike", page: "tasks", n: 12});
        choose("main");
    });

    test("a renamed page lands on its new name", async () => {
        await at("#/integrations");
        expect(await settled()).toBe("#/mcp");
    });
});

describe("addresses the viewer builds", () => {
    beforeEach(() => at("#/tasks"));

    test("a sub page opens with an empty stack", async () => {
        opening([], "log");
        expect(await settled()).toBe("#/tasks?sub=log");
        showSession("");
        expect(await settled()).toBe("#/tasks");
    });

    test("a sub page rides after the open stack", async () => {
        peek("tasks", 5, 0, "log");
        expect(await settled()).toBe("#/tasks?open=tasks:5&sub=log");
        peek("tasks", 6);
        expect(await settled()).toBe("#/tasks?open=tasks:5,tasks:6");
    });

    test("swap and unpeek keep the stack", async () => {
        swap("tasks", 9);
        expect(await settled()).toBe("#/tasks?open=tasks:9");
        unpeek();
        expect(await settled()).toBe("#/tasks");
    });

    test("opening a search result keeps the search", async () => {
        at("#/search?q=roses");
        await settled();
        peek("messages", 12);
        expect(await settled()).toBe("#/search?q=roses&open=messages:12");
        expect(route.value.q).toBe("roses");
    });

    test("a plugin opens on the Plugins page, not in a side panel", async () => {
        peek("plugins", 3);
        expect(await settled()).toBe("#/plugins?plugin=3");
    });

    test("peeking at another environment names it", async () => {
        peekThere("other", "tasks", 4);
        expect(await settled()).toBe("#/tasks?open=tasks:4@other");
    });
});

describe("a pin's link into this journal", () => {
    test("a row ref, or the journal's own address opening one, names the row to open in place; an outside link names none", async () => {
        const {refOfOwnLink, isRef} = await import("../src/route.js");
        expect(isRef("docs:55")).toBe(true);
        expect(refOfOwnLink("http://127.0.0.1:8420/?open=docs:55", "http://127.0.0.1:8420")).toBe("docs:55");
        expect(refOfOwnLink("http://127.0.0.1:8420/?open=tasks:3,docs:55#?open=docs:55", "http://127.0.0.1:8420")).toBe("tasks:3");
        expect(refOfOwnLink("http://127.0.0.1:8420/#/docs", "http://127.0.0.1:8420")).toBe("");
        expect(refOfOwnLink("https://design.example/p/1?open=docs:55", "http://127.0.0.1:8420")).toBe("");
    });
});
