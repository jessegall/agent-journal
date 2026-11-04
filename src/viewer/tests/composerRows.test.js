import {expect, test} from "vitest";
import {composerRows} from "../../core/modules/messages/web/src/composerHeight.js";

test("the composer keeps its resting rows for two lines, then shows one row more than the text, up to its limit", () => {
    expect([1, 2, 3, 4, 15, 40].map(composerRows)).toEqual([3, 3, 4, 5, 16, 16]);
});
