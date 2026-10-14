import {describe, expect, test, vi} from "vitest";

const stop = vi.fn(async () => ({}));
vi.mock("../src/api/client.js", () => ({api: {stop: () => stop()}}));

const {stopJournal, STOPPED_TEXT} = await import("../src/actions/stopJournal.js");

const later = () => new Promise((resolve) => setTimeout(resolve, 400));

describe("stopping the journal", () => {
    test("closes the tab once the server has answered", async () => {
        const close = vi.spyOn(window, "close").mockImplementation(() => {});
        await stopJournal();
        expect(stop).toHaveBeenCalled();
        expect(close).toHaveBeenCalled();
    });

    test("says the journal is stopped when the browser keeps the tab open", async () => {
        vi.spyOn(window, "close").mockImplementation(() => {});
        await stopJournal();
        await later();
        expect(document.body.textContent).toBe(STOPPED_TEXT);
    });
});
