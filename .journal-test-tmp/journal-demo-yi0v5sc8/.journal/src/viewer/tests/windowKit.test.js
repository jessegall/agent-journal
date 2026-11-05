import {expect, test} from "vitest";
import {KIT_VERSION, KIT_VUE, WINDOW_CONTEXT, useWindow} from "@journal/window-kit";
import {version} from "vue";

test("the window kit names its own version and the Vue minor version it is built for", () => {
    expect(KIT_VERSION.split(".")[0]).toBe("1");
    expect(version.startsWith(KIT_VUE)).toBe(true);
});

test("the window kit exports the key of the window context and the call that reads it", () => {
    expect(typeof WINDOW_CONTEXT).toBe("symbol");
    expect(() => useWindow()).toThrow("useWindow is called only inside a window");
});
