import {expect, test} from "vitest";
import {closed, foldersAbove, opened, shownAfterClosing, tabName} from "../src/domain/openFiles.js";

test("a file opens as a tab once, after those open", () => {
    expect(opened(["a.py"], "b.py")).toEqual(["a.py", "b.py"]);
    expect(opened(["a.py", "b.py"], "a.py")).toEqual(["a.py", "b.py"]);
    expect(opened(["a.py"], "")).toEqual(["a.py"]);
});

test("closing the tab in view shows its neighbour, the next before the previous", () => {
    const tabs = ["a.py", "b.py", "c.py"];
    expect(closed(tabs, "b.py")).toEqual(["a.py", "c.py"]);
    expect(shownAfterClosing(tabs, "b.py", "b.py")).toBe("c.py");
    expect(shownAfterClosing(tabs, "c.py", "c.py")).toBe("b.py");
    expect(shownAfterClosing(tabs, "a.py", "c.py")).toBe("c.py");
    expect(shownAfterClosing(["a.py"], "a.py", "a.py")).toBe("");
});

test("a tab is named by the file alone", () => {
    expect(tabName("src/journal/app.py")).toBe("app.py");
});

test("the tree opens down to the file in view", () => {
    expect(foldersAbove("src/app/main.py")).toEqual(["src", "src/app"]);
    expect(foldersAbove("README.md")).toEqual([]);
});
