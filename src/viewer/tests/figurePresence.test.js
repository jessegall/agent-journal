import {afterEach, expect, test} from "vitest";
import {homeElement} from "../src/figure/places.js";
import {isPresent} from "../src/figure/presence.js";

afterEach(() => {
    document.body.innerHTML = "";
});

const box = (shown) => {
    const element = document.body.appendChild(document.createElement("div"));
    element.setAttribute("data-figure-home", "");
    if (shown !== undefined) element.checkVisibility = () => shown;
    return element;
};

test("the figure's home is the compose box that is shown, never a hidden layout's box earlier in the page", () => {
    const hidden = box(false);
    const shown = box(true);
    expect(homeElement()).toBe(shown);
    hidden.remove();
    expect(homeElement()).toBe(shown);
});

test("with no way to tell what is shown, the first box is home, and with none there is no home", () => {
    expect(homeElement()).toBe(null);
    const first = box();
    box();
    expect(homeElement()).toBe(first);
});

test("a figure making its exit is no longer present, so the agent arriving during the exit brings it back", () => {
    expect(isPresent({here: true, leaving: false})).toBe(true);
    expect(isPresent({here: true, leaving: true})).toBe(false);
    expect(isPresent({here: false, leaving: false})).toBe(false);
});
