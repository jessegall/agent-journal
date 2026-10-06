import {beforeEach, describe, expect, test, vi} from "vitest";
import {stash, unstash, unstashed} from "../src/phone/stash.js";

function fakeDatabase(held, fails = false) {
    const store = {
        put: (value, key) => (held.set(key, value), {}),
        get: (key) => ({result: held.get(key)}),
        delete: (key) => (held.delete(key), {}),
    };
    const transaction = () => {
        const tx = {objectStore: () => store, oncomplete: null, onerror: null, onabort: null};
        setTimeout(() => (fails ? tx.onerror?.() : tx.oncomplete?.()));
        return tx;
    };
    return {
        open() {
            const asked = {result: {transaction, createObjectStore: () => store}, onsuccess: null, onerror: null, onupgradeneeded: null};
            setTimeout(() => (fails ? asked.onerror?.() : asked.onsuccess?.()));
            return asked;
        },
    };
}

describe("files kept for a message that has not gone", () => {
    let held;
    beforeEach(() => {
        held = new Map();
        vi.stubGlobal("indexedDB", fakeDatabase(held));
    });

    test("files are kept under the message's key, read back, and forgotten", async () => {
        const files = [new File(["x"], "a.txt")];
        await stash("k1", files);
        expect(await unstash("k1")).toBe(files);
        await unstashed("k1");
        expect(await unstash("k1")).toBeUndefined();
    });

    test("a browser that cannot keep files says nothing was kept, and never throws", async () => {
        vi.stubGlobal("indexedDB", undefined);
        await expect(stash("k", [])).resolves.toBeUndefined();
        await expect(unstash("k")).resolves.toBeUndefined();
        await expect(unstashed("k")).resolves.toBeUndefined();
    });

    test("a database that fails to open says nothing was kept", async () => {
        vi.stubGlobal("indexedDB", fakeDatabase(held, true));
        await expect(unstash("k")).resolves.toBeUndefined();
    });
});
