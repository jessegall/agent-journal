import {expect, test} from "vitest";
import {render} from "../src/text/index.js";
import "../src/text/all.js";

function shown(text, context) {
    const element = document.createElement("div");
    element.innerHTML = render(text, context);
    return element;
}

test("a row name in backticks is a chip that links to the row and not code", () => {
    const element = shown("see `message 123` first");
    const pill = element.querySelector("a.row-pill");

    expect(pill.dataset.peek).toBe("messages:123");
    expect(pill.textContent).toBe("message 123");
    expect(element.querySelector("code")).toBeNull();
    expect(element.textContent).toBe("see message 123 first");
});

test("a task, a plan and a message in backticks are each a chip", () => {
    const element = shown("`task 5`, `plan 3` and `message 123`");

    expect([...element.querySelectorAll("a.row-pill")].map((pill) => pill.dataset.peek)).toEqual(["tasks:5", "plans:3", "messages:123"]);
    expect(element.querySelector("code")).toBeNull();
});

test("a row name with a line in backticks is a chip with its place", () => {
    const pill = shown("`task 5:12-20`").querySelector("a.row-pill");

    expect([pill.dataset.peek, pill.dataset.sub]).toEqual(["tasks:5", "12-20"]);
});

test("backticks around more than a row name stay code, and the name inside is not a chip", () => {
    const element = shown("run `journal task show 5` now");

    expect(element.querySelector("code").textContent).toBe("journal task show 5");
    expect(element.querySelector("a.row-pill")).toBeNull();
});

test("a row name in backticks stays code when row names are off", () => {
    const element = shown("see `message 123`", {env: "", rowNames: false});

    expect(element.querySelector("code").textContent).toBe("message 123");
});
