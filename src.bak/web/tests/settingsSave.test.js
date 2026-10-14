import {describe, expect, test, vi} from "vitest";

const answers = [];
vi.mock("../src/api/client.js", () => ({api: {saveSettings: () => answers.shift()()}}));

const {saveSettings} = await import("../src/actions/settings.js");
const {store} = await import("../src/state/store.js");

describe("saving a setting", () => {
    test("a refused save takes its own value back out of the page even when another save came after it, so it never rides along again", async () => {
        store.settings = {linear: {board: 5, send_status: false}};
        let refuse;
        answers.push(() => new Promise((_, reject) => (refuse = reject)));
        answers.push(() => Promise.resolve(null));
        const turnedOn = saveSettings({linear: {board: 5, send_status: true}});
        await saveSettings({linear: {board: 6, send_status: true}});
        refuse(new Error("Send status changes to Linear can be turned on once stage states are set"));
        await expect(turnedOn).rejects.toThrow("stage states");
        expect(store.settings.linear).toEqual({board: 6, send_status: false});
    });
});
