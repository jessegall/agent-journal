import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

test("the shell build leaves the kit and window files beside it in place", () => {
    const config = readFileSync(resolve(__dirname, "../vite.config.js"), "utf8");
    expect(config).toContain("emptyOutDir: false");
    expect(config).not.toContain("emptyOutDir: true");
    expect(config).toContain('name: "clear-shell-assets"');
});
