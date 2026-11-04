import {expect, test, vi} from "vitest";
import OptionsPicker from "../src/shell/OptionsPicker.vue";
import {colorScheme} from "../src/windows/colorScheme.js";
import {context, mounted, settle} from "./support/windowContext.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
});

test("the options menu marks the color scheme in use and changes it", async () => {
    const element = await mounted(OptionsPicker, context({}));
    document.body.append(element);
    expect(element.querySelector("[data-options] svg")).not.toBeNull();
    element.querySelector("[data-options]").click();
    await settle();
    const item = (key) => document.body.querySelector(`[data-scheme="${key}"]`);
    expect(item("system")).not.toBeNull();
    item("dark").click();
    await settle();
    expect(colorScheme.value).toBe("dark");
});
