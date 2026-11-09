import {afterEach, expect, test} from "vitest";
import {mountedMark} from "./support/mountedMark.js";
import {styleDeclarations} from "./support/styleDeclarations.js";

const MARK = {key: "plugin:1", label: "Commandments", name: "Judged the changes", icon: "dot"};
let shown;

afterEach(() => shown?.unmount());

test("the decimal of a duration is its own element, with the whole seconds and the unit outside it", async () => {
    shown = await mountedMark({...MARK, figure: "10.5 s"});
    const figure = shown.host.querySelector(".figure");
    expect(figure.querySelector("[data-figure-decimal]").textContent).toBe(".5");
    expect(figure.textContent).toBe("10.5 s");
    expect([...figure.childNodes].filter((node) => node.nodeType === 3).map((node) => node.textContent).join("")).toBe("10 s");
});

test("the decimal is drawn smaller and more muted than the whole seconds", () => {
    const declarations = styleDeclarations("src/kit/ChatMark.vue", ".status .figure-decimal");
    expect(declarations).toMatch(/font-size:\s*0\.8em;/);
    expect(declarations).toMatch(/color:\s*color-mix\(/);
});

test("a duration with no decimal draws as before, in one text", async () => {
    shown = await mountedMark({...MARK, figure: "10 s"});
    const figure = shown.host.querySelector(".figure");
    expect(figure.querySelector("[data-figure-decimal]")).toBeNull();
    expect(figure.textContent).toBe("10 s");
});
