import {expect, test} from "vitest";
import shell from "../vite.config.js";

test("the shell build leaves the kit and window files beside it in place", () => {
    expect(shell.build.emptyOutDir).toBe(false);
    expect(shell.plugins.map((plugin) => plugin.name)).toContain("clear-shell-assets");
});
