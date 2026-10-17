import {expect, test} from "vitest";

const {render} = await import("../src/text/index.js");
const {peekChip} = await import("../src/route.js");
await import("../src/text/all.js");

const context = {
    types: [
        {name: "task", title: "Task"},
        {name: "plan", title: "Plan"},
    ],
    env: "",
};

test("a row named inside a sentence is a chip that opens the row", () => {
    const into = document.createElement("div");
    into.innerHTML = render("see task 546 and plan 12", context);
    const chips = [...into.querySelectorAll("a[data-peek]")];
    expect(chips.map((c) => c.dataset.peek)).toEqual(["task:546", "plan:12"]);
    expect(into.textContent).toBe("see task 546 and plan 12");
    into.addEventListener("click", peekChip);
    chips[1].click();
    expect(location.hash).toContain("open=plan:12");
});

test("a row named inside code or a link stays as it is", () => {
    const html = render("run `task 5` or [task 6](https://x.test)", context);
    expect(html).not.toContain("data-peek");
});
