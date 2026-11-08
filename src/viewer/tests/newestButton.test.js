import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test} from "vitest";
import {mounted} from "./support/windowContext.js";
import AutoScrollPane from "../kit/AutoScrollPane.vue";

const source = readFileSync(resolve(__dirname, "../kit/AutoScrollPane.vue"), "utf8");
const ruleOf = (selector) => source.match(new RegExp(`\\n${selector.replace(".", "\\.")} \\{([^}]*)\\}`))?.[1] ?? "";

afterEach(() => {
    document.body.innerHTML = "";
});

// The button is placed by CSS, and a test here has no layout, so it checks the placement the browser works the box out from: the button stands on a
// line with no height at the foot of the list, and that line sticks 6px above the foot of the area the reader can see. That area is the window
// when the list is as tall as the window, and the scrolling ancestor when the list is drawn taller than the screen, so the button stays inside it
// in a short window and in a tall one.
test("the Newest button stands on a line that sticks inside the visible area, not on the foot of the list", async () => {
    const element = await mounted(AutoScrollPane, {}, {rowCount: 3});
    const line = element.querySelector("[data-scroll-newest-line]");
    expect(line.contains(element.querySelector("[data-scroll-newest]"))).toBe(true);
    expect(line.parentElement.hasAttribute("data-auto-scroll")).toBe(true);
    const lineRule = ruleOf(".auto-scroll-newest-line");
    expect(lineRule).toContain("position: sticky");
    expect(lineRule).toContain("bottom: 6px");
    expect(lineRule).toContain("height: 0");
    const buttonRule = ruleOf(".auto-scroll-newest");
    expect(buttonRule).toContain("position: absolute");
    expect(buttonRule).toContain("bottom: 0");
    expect(buttonRule).not.toContain("bottom: 6px");
});

test("the Newest button still shows only after the reader has scrolled away from the foot", async () => {
    const element = await mounted(AutoScrollPane, {}, {rowCount: 3});
    expect(element.querySelector("[data-scroll-newest]").style.display).toBe("none");
});
