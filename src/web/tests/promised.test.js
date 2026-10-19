// @vitest-environment node
import {describe, expect, test, vi} from "vitest";
import {usePromised} from "../src/composables/promised.js";

describe("a promised row", () => {
    test("it shows at once with its own key, made by the user, with no id yet", () => {
        const {pending, promise} = usePromised();
        const one = promise("messages", {text: "hi"});
        const two = promise("messages", {text: "again"});
        expect(pending.value.map((p) => p.text)).toEqual(["hi", "again"]);
        expect(one.key).not.toBe(two.key);
        expect(one).toMatchObject({table: "messages", pending: true, created_by: "user", id: 0});
    });

    test("changing one leaves the others alone", () => {
        const {pending, promise, change} = usePromised();
        const one = promise("messages", {text: "a"});
        promise("messages", {text: "b"});
        change(one, {failed: true});
        expect(pending.value.map((p) => !!p.failed)).toEqual([true, false]);
    });

    test("dropping one tells its owner and removes only it", () => {
        const released = vi.fn();
        const {pending, promise, drop} = usePromised(released);
        const one = promise("messages", {text: "a"});
        promise("messages", {text: "b"});
        drop(one);
        expect(pending.value.map((p) => p.text)).toEqual(["b"]);
        expect(released).toHaveBeenCalledWith(one);
    });

    test("a listing that holds a placeholder keeps it, one that lacks it releases it once", () => {
        const released = vi.fn();
        const {pending, promise, keep} = usePromised(released);
        const one = promise("messages", {text: "a"});
        keep([{key: one.key}]);
        expect(pending.value).toHaveLength(1);
        keep([]);
        keep([]);
        expect([pending.value.length, released.mock.calls.length]).toEqual([0, 1]);
    });

    test("a real row linked to its placeholder answers to the placeholder's key", () => {
        const {promise, link, keyOf} = usePromised();
        const one = promise("messages", {text: "a"});
        link("messages:3", one.key);
        expect([keyOf({key: "messages:3"}), keyOf({key: "messages:4"})]).toEqual([one.key, "messages:4"]);
    });
});
