import {afterEach, expect, test} from "vitest";
import {mountedMark} from "./support/mountedMark.js";

const MARK = {key: "plugin:1", label: "Commandments", name: "Judged the changes", icon: "dot"};
let shown;

afterEach(() => shown?.unmount());

test.each(["10.5 s", "0.6 s", "10 s"])("the duration %s is drawn as one text, its decimal in the size and colour of the rest", async (figure) => {
    shown = await mountedMark({...MARK, figure});
    const element = shown.host.querySelector(".figure");
    expect(element.textContent).toBe(figure);
    expect(element.children.length).toBe(0);
});
