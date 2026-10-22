import {expect, test} from "vitest";

const {render} = await import("../src/text/index.js");
const {peekChip} = await import("../src/route.js");
await import("../src/text/all.js");

test("a row named inside a sentence is a chip that opens the row", () => {
    const into = document.createElement("div");
    into.innerHTML = render("see task 546 and plan 12", {env: ""});
    const chips = [...into.querySelectorAll("a[data-peek]")];
    expect(chips.map((c) => c.dataset.peek)).toEqual(["tasks:546", "plans:12"]);
    expect(into.textContent).toBe("see task 546 and plan 12");
    into.addEventListener("click", peekChip);
    chips[1].click();
    expect(location.hash).toContain("open=plans:12");
});

test("a row named inside code or a link stays as it is", () => {
    const html = render("run `task 5` or [task 6](https://x.test)", {env: ""});
    expect(html).not.toContain("data-peek");
});

test("a row named with a line, a span of lines or a section is a chip that opens the row at that place", () => {
    const into = document.createElement("div");
    into.innerHTML = render("read doc 55:120, then doc 55:10-14 and doc 55:section 3; task 7 stays plain", {env: ""});
    const chips = [...into.querySelectorAll("a[data-peek]")];
    expect(chips.map((c) => [c.dataset.peek, c.dataset.sub || ""])).toEqual([["docs:55", "120"], ["docs:55", "10-14"], ["docs:55", "section 3"], ["tasks:7", ""]]);
    expect(into.textContent).toBe("read doc 55:120, then doc 55:10-14 and doc 55:section 3; task 7 stays plain");
});
