import {describe, expect, test, vi} from "vitest";
import {usePromised} from "../src/composables/promised.js";

describe("a promised row", () => {
    test("it shows at once with its own reference", () => {
        const {pending, promise} = usePromised();
        const one = promise({type: "message", brief: "hi"});
        const two = promise({type: "message", brief: "again"});
        expect(pending.value.map((p) => p.brief)).toEqual(["hi", "again"]);
        expect(one.ref).not.toBe(two.ref);
        expect(one).toMatchObject({pending: true, who: "user", n: 0});
    });

    test("changing one leaves the others alone", () => {
        const {pending, promise, change} = usePromised();
        const one = promise({brief: "a"});
        promise({brief: "b"});
        change(one, {failed: true});
        expect(pending.value.map((p) => !!p.failed)).toEqual([true, false]);
    });

    test("dropping one tells its owner and removes only it", () => {
        const released = vi.fn();
        const {pending, promise, drop} = usePromised(released);
        const one = promise({brief: "a"});
        promise({brief: "b"});
        drop(one);
        expect(pending.value.map((p) => p.brief)).toEqual(["b"]);
        expect(released).toHaveBeenCalledWith(one);
    });

    test("a listing that holds a placeholder keeps it, one that lacks it releases it once", () => {
        const released = vi.fn();
        const {pending, promise, keep} = usePromised(released);
        const one = promise({brief: "a"});
        keep([{ref: one.ref}]);
        expect(pending.value).toHaveLength(1);
        keep([]);
        keep([]);
        expect([pending.value.length, released.mock.calls.length]).toEqual([0, 1]);
    });

    test("a real row linked to its placeholder answers to the placeholder's key", () => {
        const {promise, link, keyOf} = usePromised();
        const one = promise({brief: "a"});
        link("message:3", one);
        expect([keyOf({ref: "message:3"}), keyOf({ref: "message:4"})]).toEqual([one, "message:4"]);
    });
});
