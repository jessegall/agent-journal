import {expect, test, vi} from "vitest";
import ColorSchemePicker from "../src/shell/ColorSchemePicker.vue";
import {colorScheme} from "../src/windows/colorScheme.js";
import {context, mounted, settle} from "./support/windowContext.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
});

test("the color scheme button marks the scheme in use and changes it", async () => {
    const element = await mounted(ColorSchemePicker, context({}));
    document.body.append(element);
    expect(element.querySelector("[data-color-scheme] svg")).not.toBeNull();
    expect(element.querySelector("[data-color-scheme]").getAttribute("aria-label")).toBe("Color scheme");
    element.querySelector("[data-color-scheme]").click();
    await settle();
    const item = (key) => document.body.querySelector(`[data-scheme="${key}"]`);
    expect(item("system")).not.toBeNull();
    item("dark").click();
    await settle();
    expect(colorScheme.value).toBe("dark");
});
