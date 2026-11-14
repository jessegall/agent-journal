import {expect, test} from "vitest";

// every file of the figure that stage 1 moved is loaded as the page loads it, with no WebGL here; figure.js is left to its own loader
const FILES = import.meta.glob(["../src/figure/*.js", "!../src/figure/figure.js", "!../src/figure/assets.js"]);

test("each moved figure module imports under jsdom without WebGL", async () => {
    const names = Object.keys(FILES);
    expect(names.length).toBeGreaterThan(20);
    for (const name of names) {
        const loaded = await FILES[name]();
        expect(Object.keys(loaded).length, name).toBeGreaterThan(0);
    }
});
