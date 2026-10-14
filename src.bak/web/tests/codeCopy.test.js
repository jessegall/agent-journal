import {expect, test, vi} from "vitest";
import {render} from "../src/text/index.js";
import "../src/text/all.js";

test("every code block has its own Copy button that copies only that block and says Copied for a moment", async () => {
    const written = [];
    Object.defineProperty(navigator, "clipboard", {value: {writeText: async (text) => written.push(text)}, configurable: true});
    const into = document.createElement("div");
    into.innerHTML = render("First:\n\n```js\nconst a = 1;\n```\n\nThen:\n\n```json\n{\"b\": 2}\n```", {types: [], env: ""});
    document.body.append(into);
    const buttons = [...into.querySelectorAll(".chat-code-block > .chat-code-copy")];
    expect(buttons.map((b) => b.nextElementSibling.tagName)).toEqual(["PRE", "PRE"]);
    vi.useFakeTimers();
    buttons[1].click();
    await vi.advanceTimersByTimeAsync(0);
    expect([written, buttons[1].textContent, buttons[0].textContent]).toEqual([['{"b": 2}'], "Copied", "Copy"]);
    await vi.advanceTimersByTimeAsync(1600);
    expect(buttons[1].textContent).toBe("Copy");
    vi.useRealTimers();
    into.remove();
});
