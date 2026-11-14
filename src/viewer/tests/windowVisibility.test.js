import {expect, test} from "vitest";
import {isViewerHidden} from "../src/windows/windowVisibility.js";

test("a hidden browser tab sends its windows as hidden", () => {
    expect(isViewerHidden("hidden")).toBe(true);
});

test("a shown browser tab sends its windows as shown", () => {
    expect(isViewerHidden("visible")).toBe(false);
});
